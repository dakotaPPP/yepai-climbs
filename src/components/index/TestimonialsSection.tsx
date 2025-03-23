// Testimonials data
const testimonials = [
  {
    comment: "Yepai has completely changed how I approach new routes. The AI grading is surprisingly accurate!",
    name: "Ryan Velasco",
    role: "Competitive Climber",
    image: "/ryan.jpg",
  },
  {
    comment: "As a route setter, this tool helps me standardize our route difficulties across locations.",
    name: "Henrik Christensen",
    role: "Route Setter",
    image: "/henry.jpg",
  },
  {
    comment: "The app is intuitive and the predictions have been spot on. Great for tracking my progress.",
    name: "Gabe Luce",
    role: "Recreational Climber",
    image: "/gabe.jpg",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-yepai-blue uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 tracking-tight">
            What climbers are saying
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center space-x-1 text-yepai-blue mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">{testimonial.comment}</p>
              <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3">
                    <img src={testimonial.image} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 