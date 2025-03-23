// Steps data
const steps = [
  {
    title: "Upload your route",
    description: "Take a photo of the climbing route and upload it to the app with basic details.",
  },
  {
    title: "AI analyzes the route",
    description: "Our AI model processes the image and calculates the difficulty based on hold patterns.",
  },
  {
    title: "Get your grade",
    description: "Receive an accurate difficulty prediction within seconds and save it to your profile.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="about" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-yepai-blue uppercase tracking-wider">Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 tracking-tight">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your climbing routes graded in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mt-4 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 