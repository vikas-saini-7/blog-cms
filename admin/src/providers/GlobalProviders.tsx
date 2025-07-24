"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import PageLoader from "@/components/common/PageLoader";
import AuthProvider from "./AuthProvider";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <AuthProvider>
          <PageLoader />
          {children}
        </AuthProvider>
      </SessionProvider>
    </>
  );
};

export default GlobalProvider;
