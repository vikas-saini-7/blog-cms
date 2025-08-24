"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getRecentFollowers,
  RecentFollower,
} from "@/actions/dashboard.actions";
import { Users } from "lucide-react";

const RecentFollowers = () => {
  const [followers, setFollowers] = useState<RecentFollower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const data = await getRecentFollowers(5);
        setFollowers(data);
      } catch (error) {
        console.error("Error fetching recent followers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="col-span-1 md:col-span-1 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Recent Followers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                </div>
              </div>
            ))}
          </>
        ) : followers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No followers yet
          </p>
        ) : (
          followers.slice(0, 3).map((follower) => (
            <div key={follower.id} className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={follower.avatar || ""} />
                <AvatarFallback className="text-xs">
                  {getInitials(follower.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {follower.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(follower.followedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentFollowers;
