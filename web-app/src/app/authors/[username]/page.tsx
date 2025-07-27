"use client";
import BlogCard from "@/components/common/BlogCard";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
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
import {
  getAuthorBlogs,
  getAuthorProfile,
  AuthorBlog,
  AuthorProfile,
} from "@/actions/author.actions";
import { CalendarClock, Flame } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SORTS = ["latest", "popular"];
const TIMES = ["24h", "7d", "30d", "all"];

export default function AuthorProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { username } = useParams();

  const sort = searchParams.get("sort") ?? "latest";
  const time = searchParams.get("time") ?? "all";
  const search = searchParams.get("search") ?? "";

  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [blogs, setBlogs] = useState<AuthorBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/authors/${username}?${params.toString()}`);
  };

  const fetchAuthorData = async () => {
    try {
      setLoading(true);
      const profileData = await getAuthorProfile(username as string);
      if (!profileData) {
        toast.error("Author not found");
        return;
      }
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching author profile:", error);
      toast.error("Failed to load author profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const blogsData = await getAuthorBlogs(username as string, {
        sort: sort as "latest" | "popular",
        time: time as "24h" | "7d" | "30d" | "all",
        search: searchInput,
        page: 1,
        limit: 12,
      });
      setBlogs(blogsData.blogs);
      setHasMore(blogsData.hasMore);
      setTotalCount(blogsData.totalCount);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchAuthorData();
    }
  }, [username]);

  useEffect(() => {
    if (profile) {
      fetchBlogs();
    }
  }, [profile, sort, time, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", searchInput);
  };

  if (loading) return <ProfilePageSkeleton />;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Author Not Found</h1>
          <p className="text-muted-foreground">
            The author you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Cover Section */}
      <div className="w-full h-40 bg-gradient-to-tr from-gray-200 to-gray-100 border-b" />

      {/* Author Profile */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar || ""} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div>
                <h1 className="text-xl font-semibold">{profile.name}</h1>
                <p className="text-muted-foreground text-sm">
                  @{profile.username}
                </p>
              </div>
              {profile.bio && (
                <p className="mt-1 text-sm text-gray-600 max-w-md">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex justify-around gap-4 md:gap-6 lg:gap-10 text-2xl">
              <div className="text-center">
                <h1 className="font-bold">{profile.totalPosts}</h1>
                <p className="text-sm text-gray-500">Total Posts</p>
              </div>
              <div className="text-center">
                <h1 className="font-bold">{profile.totalViews}</h1>
                <p className="text-sm text-gray-500">Total Reads</p>
              </div>
              <div className="text-center">
                <h1 className="font-bold">{profile.totalFollowers}</h1>
                <p className="text-sm text-gray-500">Total Followers</p>
              </div>
            </div>
            <div className="px-8">
              <Button className="mt-6 w-full">Follow</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="max-w-6xl mx-auto flex items-center justify-between my-8 px-4">
        <form onSubmit={handleSearch} className="space-x-4">
          <Input
            type="text"
            className="bg-white"
            placeholder="Search Blogs"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
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
        {blogsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-500">
              {search
                ? "Try adjusting your search criteria."
                : "This author hasn't published any blogs yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
