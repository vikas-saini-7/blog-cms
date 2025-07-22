"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Register user
      const res = await axios.post("/api/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        toast.success("Account created! Logging you in...");

        // Step 2: Auto login
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.ok) {
          router.push("/");
        } else {
          toast.error("Sign in failed: " + (result?.error || "Unknown error"));
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 rounded-2xl shadow-xl p-8 bg-white mt-10">
      <h2 className="text-2xl font-bold text-center">Create your account</h2>

      <form className="space-y-4" onSubmit={handleSignup}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button className="w-full rounded-2xl" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </Button>
      </form>

      <div className="relative my-4 text-center text-muted-foreground">
        <span className="px-2 bg-white relative z-10 text-xs">
          OR continue with
        </span>
        <div className="absolute left-0 top-1/2 w-full border-t z-0" />
      </div>

      <OAuthButtons />

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
