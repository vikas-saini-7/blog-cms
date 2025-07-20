"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function Page() {
  return (
    <div className="max-w-md mx-auto space-y-6 rounded-2xl shadow-xl p-8 bg-white mt-20">
      <h2 className="text-2xl font-bold text-center">Login to your account</h2>

      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button className="w-full rounded-2xl">Login</Button>
      </form>

      <div className="relative my-4 text-center text-muted-foreground">
        <span className="px-2 bg-white relative z-10 text-xs">
          OR continue with email
        </span>
        <div className="absolute left-0 top-1/2 w-full border-t z-0" />
      </div>

      <OAuthButtons />

    </div>
  );
}
