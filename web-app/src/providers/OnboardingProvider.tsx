"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function OnboardingProvider({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isOnboardingRoute = pathname?.startsWith("/onboarding");

    if (session?.user && !session.user.isOnboarded && !isOnboardingRoute) {
      router.replace("/auth/onboarding");
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}
