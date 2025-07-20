"use client";

import React from "react";
import {
  IconHeart,
  IconMessageCircle,
  IconCalendar,
  IconHeartFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

type Blog = {
  id: string;
  title: string;
  image: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
};

const likedBlogs: Blog[] = [
  {
    id: "1",
    title: "Next.js 14 Release: Everything You Need to Know",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "Web Dev",
    likes: 122,
    comments: 34,
    date: "July 20, 2025",
  },
  {
    id: "2",
    title: "Understanding Prisma with PostgreSQL",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "Backend",
    likes: 89,
    comments: 12,
    date: "July 15, 2025",
  },
];

const LikesPage = () => {
  return (
    <section className="p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Likes</h2>

      <div className="space-y-6">
        {likedBlogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="block group"
          >
            <div className="flex gap-4 rounded-xl border shadow-sm hover:shadow-md transition p-4 bg-white dark:bg-zinc-900">
              <div className="aspect-[16/9] w-32 h-auto relative rounded-md overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  {blog.category}
                </div>
                <h2 className="text-lg font-semibold group-hover:underline font-heading">
                  {blog.title}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconHeartFilled size={16} className="text-red-500" />
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
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LikesPage;
