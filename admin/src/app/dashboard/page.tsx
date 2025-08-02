"use client";

import React from "react";
import TopicsSuggetions from "@/components/dashboard/TopicsSuggetions";
import CountStats from "@/components/dashboard/CountStats";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import RecentFollowers from "@/components/dashboard/RecentFollowers";
import LatestComments from "@/components/dashboard/LatestComments";

const DashboardPage = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CountStats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2">
          <TopicsSuggetions />
        </div>
        <RecentFollowers />
        <LatestComments />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RecentBlogs />
      </div>
    </div>
  );
};

export default DashboardPage;
