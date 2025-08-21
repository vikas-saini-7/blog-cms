"use client";

import React, { useState, useEffect } from "react";
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
      <section className="container mx-auto px-4 py-6 md:py-10 max-w-4xl min-h-screen">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading mb-2">
            Top 10 Authors
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover the most influential authors and content creators
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
              <p className="text-sm text-muted-foreground">
                Loading authors...
              </p>
            </div>
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No authors found
              </p>
              <p className="text-sm text-muted-foreground">
                No authors found for this category. Try selecting a different
                filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {authors.map((author, index) => (
              <Link
                href={`/authors/${author.username || author.id}`}
                key={author.id}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-card border rounded-lg md:rounded-xl transition-all duration-200"
              >
                {/* Rank */}
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-muted-foreground w-6 md:w-8 shrink-0">
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                    <AvatarImage className="group-hover:scale-105 transition-all ease-in-out" src={author.avatar || ""} alt={author.name} />
                    <AvatarFallback className="text-sm md:text-lg font-semibold">
                      {author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-1">
                    {author.name}
                  </h2>
                  {author.username && (
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                      @{author.username}
                    </p>
                  )}
                  {author.bio && (
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 mb-2">
                      {author.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      {author.totalFollowers}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 md:w-4 md:h-4" />
                      {author.totalPosts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      {author.totalLikes}
                    </span>
                    <span className="flex items-center gap-1 md:hidden lg:flex">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      {author.totalComments}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right text-xs md:text-sm text-muted-foreground shrink-0 min-w-0 md:mr-8">
                  <div className="font-semibold text-foreground text-sm md:text-base">
                    {author.totalViews.toLocaleString()}
                  </div>
                  <div className="text-xs whitespace-nowrap">Total Views</div>
                  {/* <div className="md:hidden mt-1 flex items-center justify-end gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {author.totalComments}
                  </div> */}
                </div>

                {/* Arrow */}
                {/* <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" /> */}
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
