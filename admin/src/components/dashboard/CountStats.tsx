"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, DashboardStats } from "@/actions/dashboard.actions";
import { Users, FileText, Eye, Heart } from "lucide-react";

const CountStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="col-span-1">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  const statsData = [
    {
      title: "Total Blogs",
      value: stats?.totalBlogs || 0,
      icon: FileText,
    },
    {
      title: "Total Views",
      value: stats?.totalViews || 0,
      icon: Eye,
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      icon: Heart,
    },
    {
      title: "Followers",
      value: stats?.followersCount || 0,
      icon: Users,
    },
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <Card key={index} className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CountStats;
