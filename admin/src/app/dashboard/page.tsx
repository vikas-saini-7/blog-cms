"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardPage = () => {
  const totalBlogs = 42;
  const recentBlogs = [
    { title: "How to Start a Blog", date: "2025-07-18" },
    { title: "10 Tips for SEO", date: "2025-07-16" },
    { title: "Markdown vs Rich Text", date: "2025-07-14" },
  ];

  const latestComments = [
    { user: "Anjali", comment: "Great post!", date: "2025-07-19" },
    { user: "Rahul", comment: "Very informative.", date: "2025-07-18" },
    { user: "Meera", comment: "Thanks for sharing!", date: "2025-07-17" },
  ];

  const followersCount = 145;
  const latestFollowers = [
    { name: "Vikas Saini", avatar: "/avatar1.png" },
    { name: "Neha Sharma", avatar: "/avatar2.png" },
    { name: "Rohit Mehta", avatar: "/avatar3.png" },
    { name: "Priya Rao", avatar: "/avatar4.png" },
    { name: "Amit Kumar", avatar: "/avatar5.png" },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Blogs */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Total Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBlogs}</p>
          </CardContent>
        </Card>

        {/* Followers Count */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{followersCount}</p>
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBlogs.map((blog, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{blog.title}</span>
                <span className="text-muted-foreground">{blog.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestComments.map((comment, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">{comment.user}</span>:{" "}
                {comment.comment}
                <div className="text-muted-foreground text-xs">{comment.date}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Latest Followers */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Followers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestFollowers.map((follower, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={follower.avatar} alt={follower.name} />
                  <AvatarFallback>{follower.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{follower.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
