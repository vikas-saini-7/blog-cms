"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CalendarClock, Flame } from "lucide-react";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BlogCard from "@/components/common/BlogCard";
import { fetchBlogs, getCategories } from "@/actions/blog.actions";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";

const SORTS = ["latest", "popular"];
const TIMES = ["24h", "7d", "30d", "all"];

function BlogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const time = searchParams.get("time") ?? "all";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<
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
          category: category || undefined,
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
    [category, sort, time, loading]
  );

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Load blogs when filters change
  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    setInitialLoad(true);
    loadBlogs(1, true);
  }, [category, sort, time]);

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
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-10">
      {/* Header + Filters */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading">
          Blog Feed
        </h1>
      </div>

      <div className="space-y-4">
        {/* Categories Section */}
        <div className="space-y-2">
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2 pb-2">
              <Button
                variant={!category ? "default" : "outline"}
                size="sm"
                className="text-xs md:text-sm rounded-full whitespace-nowrap"
                onClick={() => updateQuery("category", "")}
              >
                All
              </Button>
              {categories.map((c) => {
                const isActive = category === c.slug;
                return (
                  <Button
                    key={c.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="text-xs md:text-sm rounded-full whitespace-nowrap"
                    onClick={() => updateQuery("category", c.slug)}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Sort & Time Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* <span className="text-sm font-semibold text-gray-700">
              Sort by:
            </span> */}
            <div className="flex gap-2">
              {SORTS.map((s) => (
                <Button
                  key={s}
                  variant={sort === s ? "default" : "outline"}
                  size="sm"
                  className="text-xs md:text-sm"
                  onClick={() => updateQuery("sort", s)}
                >
                  <Flame
                    className={`h-3 w-3 mr-1 ${
                      sort === s ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <span className="text-sm font-semibold text-gray-700">
              Time range:
            </span> */}
            <div className="flex gap-2">
              {TIMES.map((t) => (
                <Button
                  key={t}
                  variant={time === t ? "default" : "outline"}
                  size="sm"
                  className="text-xs md:text-sm"
                  onClick={() => updateQuery("time", t)}
                >
                  <CalendarClock
                    className={`h-3 w-3 mr-1 ${
                      time === t ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {t.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}

        {loading &&
          initialLoad &&
          [...Array(8)].map((_, i) => <BlogCardSkeleton key={i} />)}
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

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading">
              Blog Feed
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}
