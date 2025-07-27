"use client";

import { useEffect, useState } from "react";
import { getProfileData, getUserBookmarks } from "@/actions/profile.actions";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface BookmarkedPost {
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
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData();
        if (profileData) {
          const userBookmarks = await getUserBookmarks(profileData.id);
          setBookmarks(userBookmarks);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Something went wrong while loading bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
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

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
        <p className="text-muted-foreground">
          You haven't bookmarked any posts yet. Start bookmarking posts to see
          them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-muted-foreground">
          {bookmarks.length} bookmarked posts
        </p>
      </div>

      <div className="space-y-4">
        {bookmarks.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {post.coverImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {post.author.name}
                  </span>
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="hover:text-primary"
                >
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                </Link>
                {post.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span>{post.comments}</span>
                  </div>
                  {post.publishedAt && (
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
