"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { IconEdit, IconSpeakerphone, IconStar } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

const features = [
  {
    icon: IconEdit,
    title: "Easy Editor",
    description: "Write and publish your blog using a clean, intuitive editor.",
  },
  {
    icon: IconSpeakerphone,
    title: "Instant Sharing",
    description: "Reach your audience instantly across the web.",
  },
  {
    icon: IconStar,
    title: "Grow Readership",
    description: "Build your personal brand and attract loyal readers.",
  },
];

const CTASection = () => {
  const { data: session, status } = useSession();
  return (
    <section className="container mx-auto py-12 md:py-24 pb-12 px-4">
      {/* Headline */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
          Don't just scroll, be a creator
        </h1>
        <p className="text-lg md:text-xl text-gray-500">
          Start writing blogs today. It's as easy as posting on Instagram.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-14">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white transition-colors duration-200 rounded-2xl p-4 md:p-6 text-center shadow-sm"
            >
              <div className="text-2xl md:text-3xl mb-3">
                <IconComponent size={32} className="mx-auto text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-8 md:mt-14">
        {session ? (
          <a
            href="https://pluma-admin.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="text-sm md:text-md font-bold py-4 px-6 md:py-6 md:px-8 cursor-pointer"
            >
              Go to Dashboard
            </Button>
          </a>
        ) : (
          <Link href="/auth/login">
            <Button
              size="lg"
              className="text-sm md:text-md font-bold py-4 px-6 md:py-6 md:px-8 cursor-pointer"
            >
              Start Writing
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default CTASection;
