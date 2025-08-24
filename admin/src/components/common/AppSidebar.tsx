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
    title: "Followers",
    url: "/dashboard/followers",
    icon: Users,
  },
  {
    title: "Comments",
    url: "/dashboard/comments",
    icon: MessageSquare,
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
    <Sidebar className="w-64">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex flex-col space-y-0.5 group">
            <span className="text-xl font-bold tracking-tight transition-colors flex items-center">
              <img
                src="/pluma_icon.png"
                alt="Logo"
                className="h-10 mr-3 rounded"
              />
              <div>
                <p>Pluma Admin</p>
                {status !== "loading" ? (
                  <p className="text-xs text-muted-foreground font-medium">
                    @{session?.user?.username || "username"}
                  </p>
                ) : (
                  <Skeleton className="h-3 w-20 mt-1" />
                )}
              </div>
            </span>
          </Link>
        </div>

        <div className="flex-1 p-4 pt-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "w-full justify-start h-9 rounded-l-none transition-all ease-in-out durarion-200 px-4",
                          isActive &&
                            "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className="mr-3 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
