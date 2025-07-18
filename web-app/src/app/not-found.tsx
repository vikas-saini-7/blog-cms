"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] pb-10 flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-heading">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-6 max-w-xl">
        Oops! The page you're looking for doesn’t exist or has been moved.
      </p>

      <Link href="/">
        <Button
          size="lg"
          className="text-md font-bold py-6 px-8 cursor-pointer mt-8"
        >
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
