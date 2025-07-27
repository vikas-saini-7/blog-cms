"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CalendarClock, Flame } from "lucide-react";
import { Blog } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BlogCard from "@/components/blogs/BlogCard";
import { fetchBlogs, getTags } from "@/actions/blog.actions";

const SORTS = ["latest", "popular"];
const TIMES = ["24h", "7d", "30d", "all"];

// 👇 Optional initial fallback
const INITIAL_BLOGS: Blog[] = [
  {
    id: "1",
    title: "Exploring Modern Frontend Frameworks",
    description: "A deep dive into React, Vue, Svelte and more...",
    slug: "modern-frontend-frameworks",
    coverImage:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "tech",
    likes: 120,
    comments: 34,
  },
  {
    id: "2",
    title: "The Future of Health Tech",
    description:
      "How AI and wearables are shaping the future of personal health.",
    slug: "future-health-tech",
    coverImage:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "health",
    likes: 98,
    comments: 21,
  },
  {
    id: "3",
    title: "Minimal Design Principles",
    description:
      "Learn how to apply minimalism to your UI for a better user experience.",
    slug: "minimal-design-principles",
    coverImage:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "design",
    likes: 76,
    comments: 11,
  },
  {
    id: "4",
    title: "Minimal Design Principles",
    description:
      "Learn how to apply minimalism to your UI for a better user experience.",
    slug: "minimal-design-principles",
    coverImage:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    category: "design",
    likes: 76,
    comments: 11,
  },
];

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tag = searchParams.get("tag") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const time = searchParams.get("time") ?? "all";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch blogs using server action
  const loadBlogs = useCallback(
    async (pageNum: number = 1, reset: boolean = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetchBlogs({
          tag: tag || undefined,
          sort: sort as "latest" | "popular",
          time: time as "24h" | "7d" | "30d" | "all",
          page: pageNum,
          limit: 12,
        });

        if (reset) {
          setBlogs(response.blogs);
          console.log(response.blogs);
        } else {
          setBlogs((prev) => [...prev, ...response.blogs]);
        }

        setHasMore(response.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [tag, sort, time, loading]
  );

  // Load tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    loadTags();
  }, []);

  // Load blogs when filters change
  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    setInitialLoad(true);
    loadBlogs(1, true);
  }, [tag, sort, time]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) return;

      scrollTimeout.current = setTimeout(() => {
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200;

        if (nearBottom && !loading && hasMore) {
          const nextPage = page + 1;
          loadBlogs(nextPage);
        }

        scrollTimeout.current = null;
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, loadBlogs]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center font-heading">
          Blog Feed
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-4">
          {tags.map((t) => {
            const isActive = tag === t.slug;
            return (
              <Button
                key={t.id}
                variant={isActive ? "default" : "outline"}
                className="text-sm rounded-full"
                onClick={() => updateQuery("tag", t.slug)}
              >
                #{t.name}
              </Button>
            );
          })}
          {tag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateQuery("tag", "")}
            >
              Clear
            </Button>
          )}
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

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}

        {loading &&
          initialLoad &&
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
      </div>

      {/* Scroll loading spinner */}
      {loading && !initialLoad && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {!hasMore && !loading && blogs.length > 0 && (
        <p className="text-center text-muted-foreground text-sm">
          No more blogs to load.
        </p>
      )}
    </div>
  );
}
