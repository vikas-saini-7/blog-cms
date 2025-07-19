"use client";
import BlogCard from "@/components/blogs/BlogCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Author, Blog } from "@/types";
import { CalendarClock, Flame } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const author: Author = {
  username: "vikas",
  name: "Vikas Saini",
  avatarUrl: "https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png",
  bio: "Full Stack Developer & UI/UX enthusiast 🚀",
  isProfilePublic: true,
  followersCount: 1200,
  isFollowing: false,
};

const TAGS = ["tech", "design", "entertainment", "health", "politics"];
const SORTS = ["latest", "popular"];
const TIMES = ["24h", "7d", "30d", "all"];

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

export default function AuthorProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tag = searchParams.get("tag") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const time = searchParams.get("time") ?? "all";
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/authors/${"vikas"}?${params.toString()}`);
  };
  return (
    <div className="min-h-screen w-full">
      {/* Cover Section */}
      <div className="w-full h-40 bg-gradient-to-tr from-gray-200 to-gray-100 border-b" />

      {/* Author Profile */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{author.name}</h1>
              <p className="text-muted-foreground text-sm">
                @{author.username}
              </p>
              {author.bio && (
                <p className="mt-1 text-sm text-gray-600 max-w-md">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <p className="text-sm text-gray-500">
              {author.followersCount} followers
            </p>
            <Button variant={author.isFollowing ? "outline" : "default"}>
              {author.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </Card>
      </div>

      {/* search and filters  */}
      <div className="max-w-6xl mx-auto flex items-center justify-between my-8 px-4">
        <div className="space-x-4">
          <Input type="text" className="bg-white" placeholder="Search Blogs" />
        </div>
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm flex items-center gap-2"
              >
                <Flame className="h-4 w-4" />
                {sort === "latest" ? "Latest" : "Popular"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORTS.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => updateQuery("sort", s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm flex items-center gap-2"
              >
                <CalendarClock className="h-4 w-4" />
                {time.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TIMES.map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => updateQuery("time", t)}
                >
                  {t.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
