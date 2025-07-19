"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CTASection from "@/components/landing/CTASection";
import AuthorCard from "@/components/authors/AuthorCard";
import { Author } from "@/types";

const categories = [
  { label: "All", value: "all" },
  { label: "Tech", value: "tech" },
  { label: "Design", value: "design" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Politics", value: "politics" },
];

// Simulate API call
const mockFetchAuthors = async (category: string): Promise<Author[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return Array.from({ length: 10 }, (_, i) => ({
    username: `author_${category}_${i}`,
    name: `Author ${i + 1}`,
    avatarUrl: `https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png`,
    bio:
      category === "all"
        ? "Writes across multiple categories with passion and insight."
        : `Expert in ${category}, sharing thoughts and trends.`,
    isProfilePublic: true,
    followersCount: Math.floor(Math.random() * 5000),
    isFollowing: Math.random() > 0.5,
  }));
};

const TopAuthorsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await mockFetchAuthors(activeCategory);
      setAuthors(data);
      setLoading(false);
    };
    load();
  }, [activeCategory]);

  return (
    <>
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 font-heading">
          Top 10 Authors
        </h1>

        {/* Category Filters */}
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

        {/* Author List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5">
            {authors.map((author, index) => (
              <AuthorCard author={author} rank={index+1} />
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </>
  );
};

export default TopAuthorsPage;
