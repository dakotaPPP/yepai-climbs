
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { image, holdColor, name, location, userId } = await req.json();

    // Validate required fields
    if (!image || !holdColor || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Process base64 image
    const base64Data = image.split(',')[1];
    const imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique file name
    const fileExt = 'jpg'; // Assuming JPEG format
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('route_images')
      .upload(fileName, imageData, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('route_images')
      .getPublicUrl(fileName);

    // Simulate AI prediction (to be replaced with actual model)
    const mockGrades = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"];
    const predictedGrade = mockGrades[Math.floor(Math.random() * mockGrades.length)];
    
    // Insert into routes table
    const { data: routeData, error: routeError } = await supabase
      .from('routes')
      .insert({
        user_id: userId,
        name: name || null,
        image_url: publicUrl,
        hold_color: holdColor,
        location: location || null,
        predicted_grade: predictedGrade
      })
      .select()
      .single();

    if (routeError) {
      console.error('Database insert error:', routeError);
      return new Response(
        JSON.stringify({ error: 'Failed to save route data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the result
    return new Response(
      JSON.stringify({ 
        success: true, 
        route: routeData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
