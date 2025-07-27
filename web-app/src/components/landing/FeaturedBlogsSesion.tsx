import React from "react";
import SectionTitle from "./SectionTitle";
import BlogSwiper from "./BlogSwiper";
import { getFeaturedBlogs } from "@/actions/blog.actions";

const FeaturedBlogsSesion = async () => {
  const featuredBlogs = await getFeaturedBlogs(6);

  if (featuredBlogs.length === 0) {
    return null;
  }
  return (
    <section className="container mx-auto">
      <SectionTitle title="Featured Blogs" />
      <BlogSwiper blogs={featuredBlogs} />
    </section>
  );
};

export default FeaturedBlogsSesion;
