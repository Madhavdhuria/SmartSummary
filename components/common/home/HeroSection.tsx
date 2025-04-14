import React from "react";

const HeroSection = () => {
  return (
    <section>
      <div className="relative mx-auto flex flex-col z-0 items-center py-16 sm:py-20 lg:pb-28 lg:px-12 max-w-7xl">
        <div>
          <button className="text-white p-2 rounded-4xl font-bold shadow-2xs">Powered By AI</button>
        </div>
        <h1 className="font-bold text-center py-6">
          TransForm Pdfs into <span className="bg-red-100 rounded-4xl p-1"> concise</span> summaries
        </h1>
        <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
          Get a beautiful summary reel of the document in seconds.
        </h2>
      </div>
    </section>
  );
};

export default HeroSection;
