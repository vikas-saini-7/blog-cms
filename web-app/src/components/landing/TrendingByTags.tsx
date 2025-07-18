import React from "react";
import SectionTitle from "./SectionTitle";
import BlogSwiper from "./BlogSwiper";
import { Blog } from "@/types";

const blogs: Blog[] = [
  {
    id: "1",
    title: "Why Minimalism in Web Design Works",
    slug: "minimal-web-design",
    description:
      "Discover how minimalism enhances readability, performance, and aesthetics in modern web design.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
  {
    id: "2",
    title: "Mastering Next.js for Blog Development",
    slug: "nextjs-blog-guide",
    description:
      "A practical guide to using Next.js for creating dynamic and fast-loading blog experiences.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
  {
    id: "3",
    title: "Tailwind CSS: The Utility-First Revolution",
    slug: "tailwind-utility-first",
    description:
      "How Tailwind CSS redefines styling by empowering developers to build consistent UIs rapidly.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
  {
    id: "3",
    title: "Tailwind CSS: The Utility-First Revolution",
    slug: "tailwind-utility-first",
    description:
      "How Tailwind CSS redefines styling by empowering developers to build consistent UIs rapidly.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
  {
    id: "3",
    title: "Tailwind CSS: The Utility-First Revolution",
    slug: "tailwind-utility-first",
    description:
      "How Tailwind CSS redefines styling by empowering developers to build consistent UIs rapidly.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
  {
    id: "3",
    title: "Tailwind CSS: The Utility-First Revolution",
    slug: "tailwind-utility-first",
    description:
      "How Tailwind CSS redefines styling by empowering developers to build consistent UIs rapidly.",
    image:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  },
];

const TrendingByTags = () => {
  return (
    <section className="container mx-auto">
      <SectionTitle title="Trending Blogs" />
      <BlogSwiper blogs={blogs} />
    </section>
  );
};

export default TrendingByTags;
