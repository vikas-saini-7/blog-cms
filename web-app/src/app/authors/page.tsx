"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Users,
  FileText,
  Heart,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import CTASection from "@/components/landing/CTASection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getTopAuthorsByCategory,
  getCategories,
  TopAuthor,
} from "@/actions/blog.actions";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const TopAuthorsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [authors, setAuthors] = useState<TopAuthor[]>([]);
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

  // Load authors when category changes
  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      try {
        const data = await getTopAuthorsByCategory(activeCategory, 10);
        setAuthors(data);
      } catch (error) {
        console.error("Error loading authors:", error);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    loadAuthors();
  }, [activeCategory]);

  // Build category options
  const categoryOptions = [
    { label: "All", value: "all" },
    { label: "Most Followers", value: "followers" },
    { label: "Most Posts", value: "posts" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    })),
  ];

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-4xl min-h-screen">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 font-heading">
          Top 10 Authors
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
        ) : authors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No authors found for this category.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {authors.map((author, index) => (
              <Link
                href={`/authors/${author.username || author.id}`}
                key={author.id}
                className="group flex items-center gap-4 p-4 bg-card border border-muted rounded-xl hover:shadow-md transition-all"
              >
                {/* Rank */}
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground w-8 shrink-0">
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                    <AvatarImage src={author.avatar || ""} alt={author.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:underline">
                    {author.name}
                  </h2>
                  {author.username && (
                    <p className="text-sm text-muted-foreground">
                      @{author.username}
                    </p>
                  )}
                  {author.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {author.bio}
                    </p>
                  )}

                  <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      {author.totalFollowers}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      {author.totalPosts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      {author.totalLikes}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {author.totalComments}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:block text-right text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground">
                    {author.totalViews.toLocaleString()}
                  </div>
                  <div>Total Views</div>
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

export default TopAuthorsPage;
