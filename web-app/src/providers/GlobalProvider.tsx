"use client";

import React from "react";
import PageLoader from "@/components/common/PageLoader";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import OnboardingProvider from "./OnboardingProvider";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <OnboardingProvider>
          <PageLoader />
          {children}
          <Toaster position="bottom-right" richColors />
        </OnboardingProvider>
      </SessionProvider>
    </>
  );
};

export default GlobalProvider;
