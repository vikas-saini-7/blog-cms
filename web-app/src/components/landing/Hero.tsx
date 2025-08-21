"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import heroImage from "@/assets/ai-1.png";

const Hero = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-70px)] flex container mx-auto items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
        <div className="space-y-4 sm:space-y-6 order-2 lg:order-1 text-center lg:text-left md:pl-20">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Read, Write, <br />
            Share thoughts
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 leading-relaxed">
            Read insightful blogs, write your own stories,
            <br className="hidden sm:block" />
            and join a vibrant community of creators.
          </p>
          {session ? (
            <a
              href="https://pluma-admin.vercel.app/dashboard"
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
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src={heroImage}
            alt="Hero illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain h-auto rounded-md"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
