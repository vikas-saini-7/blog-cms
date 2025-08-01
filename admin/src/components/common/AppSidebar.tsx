"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Home,
  FileText,
  MessageSquare,
  Users,
  BarChart,
  Settings,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Posts",
    url: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Comments",
    url: "/dashboard/comments",
    icon: MessageSquare,
  },
  {
    title: "My Followers",
    url: "/dashboard/my-followers",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <Sidebar className="w-64 border-r bg-background text-foreground">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wide flex-col items-start mb-8">
            <Link
              href="/"
              className="text-xl font-bold text-orange-500 font-heading"
            >
              PLUMA ADMIN
            </Link>
            {status !== "loading" ? (
              <p className="text-[10px]">
                @{session?.user?.username || "username"}
              </p>
            ) : (
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          "hover:bg-white hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive &&
                            "font-semibold shadow-sm text-orange-500 bg-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
