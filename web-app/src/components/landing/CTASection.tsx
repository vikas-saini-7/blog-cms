"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { IconEdit, IconSpeakerphone, IconStar } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CTAIImage from "@/assets/cta-image.png";

const features = [
  {
    icon: IconEdit,
    title: "Easy & Robust Editor",
    description: "Write and publish your blog using a clean, intuitive editor.",
  },
  {
    icon: IconStar,
    title: "Easy Management and Insights",
    description: "Manage and view insights how your post are performing",
  },
  {
    icon: IconSpeakerphone,
    title: "Instant Sharing",
    description: "Reach your audience instantly across the web.",
  },
];

const CTASection = () => {
  const { data: session, status } = useSession();
  return (
    <section className="container mx-auto py-12 md:py-24 px-4 rounded-lg">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left side - Image */}
        <div className="order-2 lg:order-1 w-full lg:w-3/5">
          <div className="w-full rounded-2xl overflow-hidden">
            <Image
              src={CTAIImage}
              alt="Content creation dashboard"
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="order-1 lg:order-2 w-full lg:w-2/5 space-y-6">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
              Don't just scroll, <br /> be a creator
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Start writing blogs today. It's as easy as posting on Instagram.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <IconComponent size={28} className="text-primary mr-2" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            {session ? (
              <a
                href="https://pluma-admin.vercel.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="text-md font-semibold py-3 px-6 rounded-lg"
                >
                  Go to Dashboard
                </Button>
              </a>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="text-md font-semibold py-3 px-6 rounded-lg"
                >
                  Start Writing
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
