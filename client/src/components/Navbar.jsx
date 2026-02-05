import React from "react";
import logo from "@/assets/JanSetuLogo.png";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="JanSetuLogo" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-blue-900">
            <span className="text-blue-900">Jan</span>
            <span className="text-orange-500">Setu</span>
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-blue-900 font-medium hover:text-orange-500 duration-200">Home</a>
          <a href="#features" className="text-blue-900 font-medium hover:text-orange-500 duration-200">Features</a>
          <a href="#about" className="text-blue-900 font-medium hover:text-orange-500 duration-200">About</a>
          <a href="#contact" className="text-blue-900 font-medium hover:text-orange-500 duration-200">Contact</a>
        </div>

        {/* CTA Button */}
        <button className="hidden md:block bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 duration-200">
          Report Issue
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
