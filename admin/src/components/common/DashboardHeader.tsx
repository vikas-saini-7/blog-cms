"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, Sun } from "lucide-react";

import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const user = {
  name: "Vikas",
  avatarUrl: "", // set avatar URL if you have one
};

const userDropdownLinks = [
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/dashboard", label: "Admin Dashboard" },
];

const logoutLink = {
  href: "/logout",
  label: "Logout",
};

const DashboardHeader = () => {
  const [isAuthenticated] = useState(true); // You can integrate real auth logic here

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background">
      {/* Left: Sidebar + Page Title */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold tracking-tight hidden md:block">
          Dashboard
        </h1>
      </div>

      {/* Right: Search, Theme toggle, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <Input type="text" placeholder="Search..." className="w-64" />
        </div>

        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-orange-400 transition">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 p-2 rounded-xl shadow-lg"
            >
              <div className="px-3 py-1.5 text-sm font-semibold">
                My Account
              </div>

              <div className="border-t border-gray-100/10 my-1" />

              {userDropdownLinks.map((link) => (
                <DropdownMenuItem asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-orange-100 transition"
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}

              <div className="border-t border-gray-100/10 my-1" />

              <DropdownMenuItem asChild>
                <Link
                  href={logoutLink.href}
                  className="block px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                >
                  {logoutLink.label}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
