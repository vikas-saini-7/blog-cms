"use client";

import { useEffect, useState } from "react";
import { getProfileData, getUserPosts } from "@/actions/profile.actions";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import BlogCard from "@/components/blogs/BlogCard";

interface Post {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | null;
  views: number;
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData();
        if (profileData) {
          const userPosts = await getUserPosts(profileData.id);
          setPosts(userPosts);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Something went wrong while loading posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
        <p className="text-muted-foreground">
          You haven't published any posts yet. Start writing to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <p className="text-muted-foreground">{posts.length} posts</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
