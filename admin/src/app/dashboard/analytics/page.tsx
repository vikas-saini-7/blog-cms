"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { TopPerformingBlogs } from "@/components/analytics/page";

const stats = [
  { title: "Total Views", value: "52.3k" },
  { title: "Total Likes", value: "12.1k" },
  { title: "Total Comments", value: "3.2k" },
  { title: "Total Shares", value: "5.7k" },
];

const topBlogs = [
  {
    title: "Understanding Async/Await in JavaScript",
    views: 15000,
    likes: 2300,
    comments: 430,
    daysAgo: 3,
  },
  {
    title: "UI Design Tips for Developers",
    views: 12500,
    likes: 1800,
    comments: 390,
    daysAgo: 7,
  },
];

const viewsOverTime = [
  {
    id: "Views",
    data: [
      { x: "Jul 1", y: 500 },
      { x: "Jul 5", y: 1000 },
      { x: "Jul 10", y: 1500 },
      { x: "Jul 15", y: 2000 },
      { x: "Jul 20", y: 1800 },
    ],
  },
];

const ageGroupData = [
  { id: "18-24", label: "18-24", value: 30 },
  { id: "25-34", label: "25-34", value: 40 },
  { id: "35-44", label: "35-44", value: 20 },
  { id: "45+", label: "45+", value: 10 },
];

const genderData = [
  { id: "Male", label: "Male", value: 60 },
  { id: "Female", label: "Female", value: 35 },
  { id: "Other", label: "Other", value: 5 },
];

const locationData = [
  { id: "India", label: "India", value: 45 },
  { id: "USA", label: "USA", value: 30 },
  { id: "Germany", label: "Germany", value: 15 },
  { id: "Other", label: "Other", value: 10 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Blogs */}
      <TopPerformingBlogs />

      {/* Views over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveLine
            data={viewsOverTime}
            margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              // orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Date",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              // orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Views",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={8}
            pointBorderWidth={2}
            useMesh={true}
            enableArea={true}
          />
        </CardContent>
      </Card>

      {/* Reader Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Group */}
        <Card>
          <CardHeader>
            <CardTitle>Age Group</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsivePie
              data={ageGroupData}
              margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
              innerRadius={0.3}
              padAngle={1}
              cornerRadius={5}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "paired" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#fff"
              arcLabel={(e) => `${e.label} (${e.value}%)`}
              legends={[]}
            />
          </CardContent>
        </Card>

        {/* Gender */}
        <Card>
          <CardHeader>
            <CardTitle>Gender</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsivePie
              data={genderData}
              margin={{ top: 30, right: 80, bottom: 30, left: 90 }}
              innerRadius={0.3}
              padAngle={1}
              cornerRadius={5}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "nivo" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#fff"
              arcLabel={(e) => `${e.label} (${e.value}%)`}
              legends={[]}
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsivePie
              data={locationData}
              margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
              innerRadius={0.3}
              padAngle={1}
              cornerRadius={5}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "category10" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#fff"
              arcLabel={(e) => `${e.label} (${e.value}%)`}
              legends={[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
