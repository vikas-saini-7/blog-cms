"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, MessageCircle, ArrowRight } from "lucide-react";
import clsx from "clsx";
import CTASection from "@/components/landing/CTASection";

type Blog = {
  id: string;
  title: string;
  image: string;
  category: string;
  likes: number;
  comments: number;
  description: string;
};

const categories = [
  { label: "All", value: "all" },
  { label: "Most Liked", value: "likes" },
  { label: "Most Commented", value: "comments" },
  { label: "Tech", value: "tech" },
  { label: "Design", value: "design" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Politics", value: "politics" },
//   { label: "Business", value: "business" },
];

const mockFetchBlogs = async (category: string): Promise<Blog[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${category}-${i}`,
    title: `Top Blog Title ${i + 1}`,
    description: `This is a short summary of blog post #${
      i + 1
    }. It provides insight into the topic and why it's trending.`,
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
  }));
};

const TopBlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await mockFetchBlogs(activeCategory);
      setBlogs(data);
      setLoading(false);
    };
    load();
  }, [activeCategory]);

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 font-heading">
          Top 10 Blogs
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.value)}
              className="capitalize text-sm"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5">
            {blogs.map((blog, index) => (
              <Link
                href={`/blogs/${blog.id}`}
                key={blog.id}
                className="group flex items-center gap-4 p-4 bg-card border border-muted rounded-xl hover:shadow-md transition-all"
              >
                {/* Rank */}
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground w-8 shrink-0">
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:underline line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {blog.description}
                  </p>

                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {blog.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {blog.comments}
                    </span>
                    <span className="hidden sm:inline capitalize">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        )}
      </section>
      <CTASection />
    </>
  );
};

export default TopBlogsPage;
