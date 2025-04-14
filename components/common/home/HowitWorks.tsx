import { BrainCircuit, FileIcon, FileOutput } from "lucide-react";
import React, { ReactNode } from "react";

type step = {
  icon: ReactNode;
  title: string;
  description: string;
};

const HowitWorks = () => {
  const steps: step[] = [
    {
      icon: <FileIcon size={64} strokeWidth={1.5} />,
      title: "Upload Your Pdf",
      description: "Upload your Pdf file to get Started",
    },
    {
      icon: <BrainCircuit size={64} strokeWidth={1.5} />,
      title: "Ai Analysis",
      description:
        "Our Advanced AI Processes and analyzes your document instantly",
    },
    {
      icon: <FileOutput size={64} strokeWidth={1.5} />,
      title: "Get Summary",
      description: "Get a clear concise summary of your document",
    },
  ];
  return (
    <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="font-bold text-xl uppercase text-rose-500 mb-4">
          How it Works
        </h2>
        <h3 className="font-bold text-3xl max-w-2xl mx-auto">
          Transform any PDFS into easy to digest summary in Three easy steps
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
        {steps.map((step, idx) => (
          <StepItem key={idx} {...step} />
        ))}
      </div>
    </div>
  );
};

function StepItem({ icon, title, description }: step) {
  return (
    <div className="flex flex-col gap-4 h-full hover:border-1 ease-in-out rounded-2xl">
      <div className="flex items-center justify-center mx-auto h-24 w-24 rounded-2xl bg-linear-to-br from-rose-500/10 to-transparent">
        <div className="text-rose-500">{icon}</div>
      </div>
        <h4 className="text-xl font-bold text-center">{title}</h4>
        <p className="text-center text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default HowitWorks;
