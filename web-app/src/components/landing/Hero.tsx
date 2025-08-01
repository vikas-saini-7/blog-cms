import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex container mx-auto items-center px-4 pb-20">
      <div className="space-y-4 w-full md:w-[90%] lg:w-[80%] mx-auto">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          Read, Write, <br />
          Share thoughts
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-500 leading-relaxed">
          Read insightful blogs, write your own stories,{" "}
          <br className="hidden md:block" />
          and join a vibrant community of creators.
        </p>
        <Link href="/auth/register">
          <Button
            size="lg"
            className="text-sm md:text-md font-bold py-4 px-6 md:py-6 md:px-8 cursor-pointer mt-6"
          >
            Start Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
