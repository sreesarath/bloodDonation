import React from 'react';
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Logo & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-red-600">
            🩸 BloodFinder
          </div>

          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/donors" className="hover:text-red-600 transition">Find Donors</Link>
            <Link to="/request" className="hover:text-red-600 transition">Request Blood</Link>
            <Link to="/about" className="hover:text-red-600 transition">About Us</Link>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} BloodFinder. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> to save lives
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;