"use client";

import PageLoader from "@/components/common/PageLoader";
import React from "react";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageLoader />
      {children}
    </>
  );
};

export default GlobalProvider;
