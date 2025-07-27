import React from "react";
import SectionTitle from "./SectionTitle";
import BlogSwiper from "./BlogSwiper";
import { getBlogsByTag } from "@/actions/blog.actions";

const TrendingByTags = async () => {
  const trendingBlogs = await getBlogsByTag("tech");

  if (trendingBlogs.length === 0) {
    return null;
  }
  return (
    <section className="container mx-auto">
      <SectionTitle title="Trending Blogs" />
      <BlogSwiper blogs={trendingBlogs} />
    </section>
  );
};

export default TrendingByTags;
