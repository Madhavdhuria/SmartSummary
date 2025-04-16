import { Pizza } from "lucide-react";
import React from "react";

const DemoSection = () => {
  return (
    <div className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className=" flex flex-col items-center text-center space-y-4">
          <Pizza className="h-6 w-6 text-rose-500" />
          <h3 className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
            Look How SmartSummary  transform{"  "}
            <span className="bg-linear-to-r from-rose-500 to-rose-900 bg-clip-text text-transparent">
              this Next.js course pdf
            </span>{" "}
            into an easy to read summary!
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;
