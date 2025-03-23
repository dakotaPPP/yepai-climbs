import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div 
            className="cursor-pointer mb-6 md:mb-0"
            onClick={() => navigate("/")}
          >
            <span className="text-2xl font-semibold font-parkinsans tracking-tighter text-black" style={{ letterSpacing: "-0.05em" }}>
              YepAI
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <a href="#" className="hover:text-yepai-blue transition-colors">Features</a>
            <a href="#" className="hover:text-yepai-blue transition-colors">About</a>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex justify-center md:justify-start">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} YepAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 