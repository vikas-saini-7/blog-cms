"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Eye,
} from "lucide-react";
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
      <section className="container mx-auto px-4 py-6 md:py-10 max-w-4xl min-h-screen">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading mb-2">
            Top 10 Blogs
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover the most popular blogs across different categories
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 md:mb-8">
          <ScrollArea className="w-full whitespace-nowrap pb-1">
            <div className="flex w-max space-x-2 pb-2">
              {categoryOptions.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.value)}
                  className="text-xs md:text-sm whitespace-nowrap rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-sm text-muted-foreground">Loading blogs...</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No blogs found
              </p>
              <p className="text-sm text-muted-foreground">
                No blogs found for this category. Try selecting a different
                filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {blogs.map((blog, index) => (
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog.id}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-card border border-muted rounded-lg md:rounded-xl hover:shadow-md transition-all duration-200"
              >
                {/* Rank */}
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-muted-foreground w-6 md:w-8 shrink-0">
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 h-14 md:w-28 md:h-20 lg:w-36 lg:h-24 rounded-md overflow-hidden shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm md:text-base lg:text-lg font-semibold text-foreground group-hover:underline line-clamp-2 mb-2">
                    {blog.title}
                  </h2>

                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="text-xs">
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      </span>
                      <span>{blog.views}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{blog.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{blog.comments}</span>
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
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
