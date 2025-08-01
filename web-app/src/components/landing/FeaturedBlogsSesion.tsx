"use client";
import React, { useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import BlogSwiper from "./BlogSwiper";
import { Blog } from "@/types";
import { getFeaturedBlogs } from "@/actions/blog.actions";
import BlogSwiperSkeleton from "../skeletons/BlogSkeletonSwiper";

const FeaturedBlogsSesion = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true);
        const featuredBlogs = await getFeaturedBlogs(6);
        setBlogs(featuredBlogs);
      } catch (error) {
        console.error("Error fetching featured blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <SectionTitle title="Featured Blogs" />
        <BlogSwiperSkeleton />
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <SectionTitle title="Featured Blogs" />
      <BlogSwiper blogs={blogs} />
    </section>
  );
};

export default FeaturedBlogsSesion;
