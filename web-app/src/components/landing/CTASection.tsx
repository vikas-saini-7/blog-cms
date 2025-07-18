import React from "react";
import { Button } from "../ui/button";

const features = [
  {
    icon: "✍️",
    title: "Easy Editor",
    description: "Write and publish your blog using a clean, intuitive editor.",
  },
  {
    icon: "📢",
    title: "Instant Sharing",
    description: "Reach your audience instantly across the web.",
  },
  {
    icon: "🌟",
    title: "Grow Readership",
    description: "Build your personal brand and attract loyal readers.",
  },
];

const CTASection = () => {
  return (
    <section className="container mx-auto py-24 pb-12 px-4">
      {/* Headline */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold font-heading leading-tight">
          Don’t just scroll, be a creator
        </h1>
        <p className="text-xl text-gray-500">
          Start writing blogs today. It’s as easy as posting on Instagram.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white transition-colors duration-200 rounded-2xl p-6 text-center shadow-sm"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-14">
        <Button
          size="lg"
          className="text-md font-bold py-6 px-8 cursor-pointer"
        >
          Start Writing
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
