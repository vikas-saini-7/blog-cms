import React from "react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex container mx-auto items-center pb-20">
      <div className="space-y-4 md:w-[90%] lg:w-[80%] mx-auto">
        <h1 className="font-heading text-7xl font-bold">
          Start Sharing, <br />
          your thoughts
        </h1>
        <h1 className="text-2xl text-gray-500">
          Read insightful blogs, write your own stories, <br />
          and join a vibrant community of creators.
        </h1>
        <Button
          size="lg"
          className="text-md font-bold py-6 px-8 cursor-pointer mt-8"
        >
          Start Now
        </Button>
      </div>
    </div>
  );
};

export default Hero;
