// components/ui/page-loader.tsx
"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

// Optional: Customize NProgress style
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.25,
});

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // you can tweak this delay

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  return null;
}
