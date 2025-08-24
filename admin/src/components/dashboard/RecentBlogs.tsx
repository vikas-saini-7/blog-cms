"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentBlogs, RecentBlog } from "@/actions/dashboard.actions";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";

const RecentBlogs = () => {
  const [blogs, setBlogs] = useState<RecentBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getRecentBlogs(5);
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "Draft";
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Recent Blogs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No blogs found. Start writing your first blog!
          </p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium line-clamp-1">
                  {blog.title}
                </span>
                <Badge className={`text-xs ${getStatusColor(blog.status)}`}>
                  {blog.status}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDate(blog.publishedAt)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {blog.views}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBlogs;
