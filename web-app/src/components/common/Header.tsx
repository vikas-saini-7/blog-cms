"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import HeaderAuthSkeleton from "../skeletons/HeaderAuthSkeleton";

const commonLinks = [
  { href: "/popular", label: "Popular" },
  { href: "/blogs", label: "Blogs" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
];

const userDropdownLinks = [
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/dashboard", label: "Admin Dashboard" },
];

export default function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b sticky top-0 bg-white dark:bg-black z-50 py-2 h-[80] flex items-center">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-orange-500 font-heading"
        >
          BLOG CMS
        </Link>

        <nav className="hidden md:flex space-x-6 text-md font-medium items-center">
          {commonLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="hover:text-orange-500 transition-colors px-2 py-2 duration-300 ease-in-out"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {status === "loading" && <HeaderAuthSkeleton />}
          {status !== "loading" && !session?.user && (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="px-8 py-5 text-md">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="px-8 py-5 text-md">Regiter</Button>
              </Link>
            </>
          )}

          {session?.user && (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all duration-200 h-10 w-10">
                    {session?.user.avatar && (
                      <AvatarImage
                        src={session.user?.avatar}
                        alt={session?.user?.name}
                      />
                    )}
                    <AvatarFallback>{session?.user?.name[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 p-2 rounded-xl shadow-lg"
                >
                  <div className="px-3 py-1.5 text-sm font-semibold ">
                    My Account
                  </div>
                  <div className="border-t border-gray-100/10 my-1" />

                  {userDropdownLinks.map((link) => (
                    <DropdownMenuItem asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-3 py-2 rounded-md text-sm hover:bg-orange-100  transition"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <div className="border-t border-gray-100/10 my-1" />

                  <DropdownMenuItem asChild>
                    <div
                      onClick={() => signOut()}
                      className="block px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
