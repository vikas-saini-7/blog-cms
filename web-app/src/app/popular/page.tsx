"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, MessageCircle, ArrowRight } from "lucide-react";
import CTASection from "@/components/landing/CTASection";
import {
  getTopBlogsByCategory,
  getCategories,
  TopBlog,
} from "@/actions/blog.actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const TopBlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [blogs, setBlogs] = useState<TopBlog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load blogs when category changes
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const data = await getTopBlogsByCategory(activeCategory, 10);
        setBlogs(data);
      } catch (error) {
        console.error("Error loading blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [activeCategory]);

  // Build category options
  const categoryOptions = [
    { label: "All", value: "all" },
    { label: "Most Liked", value: "likes" },
    { label: "Most Commented", value: "comments" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    })),
  ];

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-4xl min-h-screen">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 font-heading">
          Top 10 Blogs
        </h1>

        {/* Filters */}
        <ScrollArea className="w-full whitespace-nowrap mb-10 pb-2">
          <div className="flex w-max space-x-2 p-1">
            {categoryOptions.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.value)}
                className="capitalize text-sm whitespace-nowrap"
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No blogs found for this category.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {blogs.map((blog, index) => (
              <Link
                href={`/blogs/${blog.slug}`}
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
                    src={
                      blog.coverImage ||
                      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp"
                    }
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
                    {blog.description || "No description available."}
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
