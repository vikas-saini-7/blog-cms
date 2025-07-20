"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, Search, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background">
      {/* Left side: SidebarTrigger and Page title */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle on mobile */}
        <SidebarTrigger />

        <h1 className="text-xl font-semibold tracking-tight hidden md:block">
          Dashboard
        </h1>
      </div>

      {/* Right side: Search, theme toggle, notifications, profile */}
      <div className="flex items-center gap-4">
        {/* Search input (optional) */}
        <div className="hidden md:block">
          <Input type="text" placeholder="Search..." className="w-64" />
        </div>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.png" alt="@user" />
          <AvatarFallback>VS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DashboardHeader;
