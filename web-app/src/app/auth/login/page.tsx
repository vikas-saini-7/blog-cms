"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        console.error("Login failed:", result?.error);
        toast.error("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 rounded-2xl shadow-xl p-8 bg-white mt-10">
      <h2 className="text-2xl font-bold text-center">Login to your account</h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="relative my-4 text-center text-muted-foreground">
        <span className="px-2 bg-white relative z-10 text-xs">
          OR continue with email
        </span>
        <div className="absolute left-0 top-1/2 w-full border-t z-0" />
      </div>

      <OAuthButtons />

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
