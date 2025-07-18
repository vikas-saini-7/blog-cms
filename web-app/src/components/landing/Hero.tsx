import React from "react";
import { Button } from "../ui/button";
import PrimaryButton from "../common/PrimaryButton";

const Hero = () => {
  return (
    <div className="h-[70vh] flex container mx-auto items-center">
      <div className="space-y-4">
        <h1 className="font-heading text-7xl font-bold">
          Star Sharing thoughts
        </h1>
        <h1 className="text-xl text-gray-500">
          Read insightful blogs, write your own stories, <br />
          and join a vibrant community of creators.
        </h1>
        <PrimaryButton value="Start Now" variant="default" />
      </div>
    </div>
  );
};

export default Hero;
