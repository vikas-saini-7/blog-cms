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
import sideImage from "@/assets/ai-2.png";
import Image from "next/image";

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
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative bg-gray-900">
        <Image
          src={sideImage}
          alt="Register illustration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right side - Form */}
      <div className="w-1/2 flex items-center justify-center px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your free account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <Button
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <OAuthButtons />

          <p className="text-center text-sm text-gray-600 pt-4">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
