import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

export default function JNCHeader() {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    { color: "from-slate-900/90 to-blue-900/80" },
    { color: "from-blue-900/90 to-emerald-900/80" },
    { color: "from-emerald-900/90 to-slate-900/80" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${heroImages[currentImage].color} transition-all duration-2000`}
        >
          {/* Subtle Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-0 h-full flex flex-col">
        {/* Hero Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center text-white space-y-8">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Bespoke Kitchens
              <span className="block bg-gradient-to-r from-blue-300 via-emerald-300 to-blue-300 bg-clip-text text-transparent">
                & Bathrooms
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              From initial concept to final installation, we create stunning,
              functional spaces tailored to your vision
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/dashboard"
                className="group bg-white text-blue-900 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>
                  Start Your Project
                  {/* <Link to="/dashboard">Start Your Project</Link> */}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/kitchens"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                View Our Work
                {/* <Link to="/kitchens">View Our Work</Link> */}
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-5xl font-bold">500+</div>
                <div className="text-white/70 text-sm">Projects</div>
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-bold">15+</div>
                <div className="text-white/70 text-sm">Years</div>
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-bold">98%</div>
                <div className="text-white/70 text-sm">Satisfied</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Indicators */}
        <div className="pb-8 flex justify-center">
          <div className="flex space-x-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`transition-all duration-500 rounded-full ${
                  currentImage === idx
                    ? "bg-white w-12 h-2"
                    : "bg-white/40 w-2 h-2 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
