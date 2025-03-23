export interface Route {
  id: string;
  name: string | null;
  image_url: string;
  hold_color: string;
  location: string | null;
  predicted_grade: string;
  user_feedback: 'like' | 'dislike' | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type HoldColor = 
  | 'red' 
  | 'blue' 
  | 'green' 
  | 'yellow' 
  | 'orange' 
  | 'purple' 
  | 'pink' 
  | 'black' 
  | 'white' 
  | 'gray';
