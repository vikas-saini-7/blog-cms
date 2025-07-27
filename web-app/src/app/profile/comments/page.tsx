"use client";

import { useEffect, useState } from "react";
import { getProfileData, getUserComments } from "@/actions/profile.actions";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

interface UserComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean | null;
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData();
        if (profileData) {
          const userComments = await getUserComments(profileData.id);
          setComments(userComments);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Something went wrong while loading comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No comments yet</h2>
        <p className="text-muted-foreground">
          You haven't commented on any posts yet. Start engaging with posts to
          see your comments here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Comments</h1>
        <p className="text-muted-foreground">{comments.length} comments</p>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/posts/${comment.post.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  Commented on: {comment.post.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {comment.isEdited && (
                    <span className="text-orange-600">(edited)</span>
                  )}
                </div>
              </div>
              <div className="text-sm leading-relaxed">{comment.content}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
