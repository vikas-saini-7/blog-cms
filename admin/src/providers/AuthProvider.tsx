"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log(session);
  }, []);
  if (status !== "loading" && status === "unauthenticated") {
    router.push("/");
  }
  return <>{children}</>;
};

export default AuthProvider;
