"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type Follower = {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  followedAt: Date;
};

const dummyFollowers: Follower[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i}`,
  name: `User ${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  image:
    "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  followedAt: new Date(Date.now() - i * 60 * 1000), // i mins ago
}));

export default function MyFollowersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredFollowers = dummyFollowers
    .filter((f) =>
      [f.name, f.username, f.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "newest"
        ? b.followedAt.getTime() - a.followedAt.getTime()
        : a.followedAt.getTime() - b.followedAt.getTime()
    );

  return (
    <div className="p-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder="Search followers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Followers List */}
      <div className="space-y-4">
        {filteredFollowers.map((follower) => (
          <Card key={follower.id}>
            <CardHeader className="flex flex-row items-start gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={follower.image} />
                <AvatarFallback>{follower.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{follower.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  @{follower.username}
                </p>
                <p className="text-sm text-muted-foreground">{follower.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Followed {formatDistanceToNow(follower.followedAt, { addSuffix: true })}
                </p>
              </div>

              <Link href={`/users/${follower.username}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredFollowers.length === 0 && (
        <p className="text-muted-foreground text-center mt-10">
          No followers found.
        </p>
      )}
    </div>
  );
}
