import React from "react";
import SectionTitle from "./SectionTitle";
import { Blog } from "@/types";
import BlogSwiper from "./BlogSwiper";
import { getPopularBlogs } from "@/actions/blog.actions";


const PopularSection = async () => {
  const popularBlogs = await getPopularBlogs(6);

  if (popularBlogs.length === 0) {
    return null;
  }
  return (
    <section className="container mx-auto">
      <SectionTitle title="Popular Blogs" />
      <BlogSwiper blogs={popularBlogs} />
    </section>
  );
};

export default PopularSection;
