"use client";
import React, { useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import { Blog } from "@/types";
import BlogSwiper from "./BlogSwiper";
import { getPopularBlogs } from "@/actions/blog.actions";
import BlogCardSkeleton from "../skeletons/BlogCardSkeleton";
import BlogSwiperSkeleton from "../skeletons/BlogSkeletonSwiper";

const PopularSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        setLoading(true);
        const popularBlogs = await getPopularBlogs(6);
        setBlogs(popularBlogs);
      } catch (error) {
        console.error("Error fetching popular blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBlogs();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <SectionTitle title="Popular Blogs" />
        <BlogSwiperSkeleton />
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <SectionTitle title="Popular Blogs" />
      <BlogSwiper blogs={blogs} />
    </section>
  );
};

export default PopularSection;
