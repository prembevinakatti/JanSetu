import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-900 text-white py-3">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm">
        
        {/* Left Text */}
        <p className="opacity-80">
          © {new Date().getFullYear()} JanSetu. All Rights Reserved.
        </p>

        {/* Right Text */}
        <p className="opacity-80">
          Empowering Citizens • Enabling Governance
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
