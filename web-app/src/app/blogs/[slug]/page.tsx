import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Author, Blog } from "@/types";
import BlogCard from "@/components/blogs/BlogCard";
import SectionTitle from "@/components/landing/SectionTitle";
import {
  CopyIcon,
  LinkedinIcon,
  RectangleVerticalIcon,
  TwitterIcon,
} from "lucide-react";
import { LikeButton } from "@/components/blog/LikeButton";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { CommentButton } from "@/components/blog/CommentButton";
import CommentsContainer from "@/components/blog/CommentsContainer";
import AddComment from "@/components/blog/AddComment";
import AuthorCard from "@/components/authors/AuthorCard";
import { BookmarkButton } from "@/components/blog/BookmarkButton";

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
];

const author: Author = {
  username: "vikas_saini",
  name: "Vikas Saini",
  avatarUrl: "https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png",
  bio: "Full Stack Developer with a passion for clean UI and scalable systems.",
  isProfilePublic: true,
  followersCount: 3439,
  isFollowing: false,
};

export default function BlogDetailPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight tracking-tight font-heading">
        How to Build a Blog in Next.js 14 with App Router
      </h1>

      {/* Cover Image */}
      {/* <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
        <Image
          src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp"
          alt="Cover Image"
          fill
          className="object-cover"
        />
      </div> */}
      <div className="w-full aspect-video relative rounded-2xl">
        <Image
          src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp"
          alt="Cover Image"
          fill
          className="object-cover"
        />
        <BookmarkButton />
      </div>

      {/* Posted Date & Time */}
      <p className="text-muted-foreground text-sm">
        Posted on July 19, 2025 • 10:30 AM
      </p>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Building a modern blog using Next.js 14 App Router is easier than
          ever. You can create dynamic routing, static generation, and seamless
          layouts all using React Server Components.
        </p>
        <p>
          In this post, we explore the full setup — from dynamic routes using
          `[slug]`, rich markdown content, and sharing capabilities, to
          rendering comments and author information.
        </p>
        <h2>Getting Started</h2>
        <p>
          Start by creating the `blogs/[slug]/page.tsx` file and fetching the
          necessary data.
        </p>
      </div>

      <div className="flex items-center justify-center my-6 mt-12 uppercase">
        <div className="flex items-center w-full gap-4 text-center text-muted-foreground text-sm">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 whitespace-nowrap">Thanks for reading</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
      </div>

      {/* Share + Like Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl">
        {/* Like Section */}
        <div className="flex items-center gap-4">
          <LikeButton />
          <CommentButton />
        </div>

        {/* Share Buttons */}
        <ShareButtons />
      </div>

      {/* Author Info */}
      <div id="comments">
        <h1 className="text-2xl font-semibold mb-2 font-heading">Author</h1>
        <AuthorCard author={author} />
      </div>

      {/* Comments */}
      <div>
        <h3 className="text-2xl font-semibold mb-2 font-heading">Comments</h3>
        <AddComment />
        <CommentsContainer />
      </div>

      {/* Related Blogs */}
      <div className="mt-20">
        {/* <h3 className="text-2xl font-semibold mb-4">Related Blogs</h3> */}
        <SectionTitle title="Related Blogs" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <BlogCard key={idx} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
