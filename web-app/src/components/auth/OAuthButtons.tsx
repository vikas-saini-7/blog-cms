"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 rounded-2xl shadow-sm"
      >
        <IconBrandGoogle size={20} />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 rounded-2xl shadow-sm"
      >
        <IconBrandGithub size={20} />
        Continue with GitHub
      </Button>
    </div>
  );
}
