"use client";

import React from "react";
import {
  IconMessageCircle,
  IconCalendar,
  IconHeartFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkButton } from "@/components/blog/BookmarkButton";

type Blog = {
  id: string;
  title: string;
  image: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
};

const bookmarkedBlogs: Blog[] = [
  {
    id: "1",
    title: "React Server Components Explained",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "Frontend",
    likes: 75,
    comments: 21,
    date: "July 12, 2025",
  },
  {
    id: "2",
    title: "A Guide to Tailwind CSS Best Practices",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "Design",
    likes: 42,
    comments: 7,
    date: "June 28, 2025",
  },
];

export default function Page() {
  return (
    <section className="p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>

      {bookmarkedBlogs.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t bookmarked any blogs yet.
        </p>
      ) : (
        <div className="space-y-6">
          {bookmarkedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="block group relative"
            >
              <div className="flex gap-4 rounded-xl border shadow-sm hover:shadow-md transition p-4 bg-white dark:bg-zinc-900">
                {/* Image */}
                <div className="aspect-[16/9] w-32 h-auto relative rounded-md overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Blog Content */}
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    {blog.category}
                  </div>
                  <h2 className="text-lg font-semibold group-hover:underline font-heading">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconHeartFilled className="text-red-500" size={16} />{" "}
                      {blog.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconMessageCircle size={16} />
                      {blog.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendar size={16} />
                      {blog.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bookmark Button */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <BookmarkButton size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
