"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestComments, LatestComment } from "@/actions/dashboard.actions";
import { MessageCircle } from "lucide-react";

const LatestComments = () => {
  const [comments, setComments] = useState<LatestComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getLatestComments(5);
        setComments(data);
      } catch (error) {
        console.error("Error fetching latest comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return diffHours === 0 ? "Just now" : `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card className="col-span-1 md:col-span-1 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Latest Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet
          </p>
        ) : (
          comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="text-sm space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-xs">
                  {comment.author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {truncateContent(comment.content)}
              </p>
              <p className="text-xs text-muted-foreground">
                on "{truncateContent(comment.post.title, 30)}"
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LatestComments;
