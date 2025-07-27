// app/(author)/layout.tsx or app/author/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconBookmark,
  IconHeart,
  IconMessageCircle,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import { getProfileData, ProfileData } from "@/actions/profile.actions";

const tabs = [
  { href: "/profile", label: "Profile", icon: IconUser },
  { href: "/profile/bookmarks", label: "Bookmarks", icon: IconBookmark },
  { href: "/profile/likes", label: "Likes", icon: IconHeart },
  { href: "/profile/comments", label: "Comments", icon: IconMessageCircle },
  { href: "/profile/account", label: "Account", icon: IconSettings },
];

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData();
        if (profileData) {
          setProfile(profileData);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Something went wrong while loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <ProfilePageSkeleton />;

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-muted-foreground">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full h-40 bg-gradient-to-tr from-gray-200 to-gray-100 border-b" />

      {/* Profile card */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={profile.avatar || undefined}
                alt={profile.name}
              />
              <AvatarFallback>{profile.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{profile.name}</h1>
              <p className="text-muted-foreground text-sm">
                @{profile.username || "username"}
              </p>
              {profile.bio && (
                <p className="mt-1 text-sm text-gray-600 max-w-md">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-around gap-4 md:gap-6 lg:gap-10 text-2xl w-1/2">
            <div className="text-center">
              <h1 className="font-bold">{profile.stats.totalPosts}</h1>
              <p className="text-sm text-gray-500">Total Posts</p>
            </div>
            <div className="text-center">
              <h1 className="font-bold">{profile.stats.totalReads}</h1>
              <p className="text-sm text-gray-500">Total Reads</p>
            </div>
            <div className="text-center">
              <h1 className="font-bold">{profile.stats.totalFollowers}</h1>
              <p className="text-sm text-gray-500">Total Followers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 space-y-2 text-sm font-medium">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left hover:bg-muted ${
                pathname === tab.href ? "bg-muted text-primary" : ""
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
