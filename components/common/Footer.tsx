import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="text-sm">
          © {new Date().getFullYear()} . All rights reserved.
        </div>
        <div className="text-sm">
          Made by <span className="font-semibold">Madhav</span> — Personal AI Integrated App
        </div>
      </div>
    </footer>
  );
};

export default Footer;
