"use client";

import { useEffect, useState, useCallback } from "react";
import { deleteBlog, getUserBlogs } from "@/actions/post.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types";
import BlogSkeleton from "@/components/skeletons/BlogTableSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type BlogWithStatus = Blog & {
  status: "draft" | "published";
  likesCount: number;
  commentsCount: number;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function PostsPage() {
  const [blogs, setBlogs] = useState<BlogWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Simple local state
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [searchInput, setSearchInput] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [slugToConfirm, setSlugToConfirm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<BlogWithStatus | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch blogs function
  const fetchBlogs = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await getUserBlogs({
          page: currentPage,
          limit: 7,
          status: currentFilter,
          search: searchInput,
        });

        if (res.success && res.blogs && res.pagination) {
          setBlogs(
            res.blogs.map((b: any) => ({
              id: b.id,
              title: b.title,
              description: b.description || "",
              image: b.coverImage || "/placeholder-blog.jpg",
              slug: b.slug,
              views: b.views || 0,
              likes: b.likesCount || 0,
              comments: b.commentsCount || 0,
              status: (b.status === "DRAFT" ? "draft" : "published") as
                | "draft"
                | "published",
              likesCount: b.likesCount || 0,
              commentsCount: b.commentsCount || 0,
            }))
          );
          setPagination(res.pagination);
        } else {
          setBlogs([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, currentFilter, searchInput]
  );

  // Effects
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Event handlers
  const handleFilterChange = (newFilter: string) => {
    setCurrentFilter(newFilter as "all" | "draft" | "published");
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDeleteClick = (blog: BlogWithStatus) => {
    setSelectedBlog(blog);
    setSlugToConfirm("");
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedBlog && slugToConfirm === selectedBlog.slug) {
      setIsDeleting(true);
      try {
        const res = await deleteBlog(selectedBlog.id);
        if (res.success) {
          setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
          setOpenDialog(false);
          toast.success("Blog deleted successfully");
          // Refresh the list to update pagination
          await fetchBlogs(true);
        } else {
          toast.error(res.message || "Failed to delete blog");
        }
      } catch (error) {
        toast.error("Failed to delete blog");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchBlogs(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">My Blogs</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Link href="/dashboard/blog-editor">
            <Button>Create Blog</Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={currentFilter} onValueChange={handleFilterChange}>
          <TabsList className="bg-white">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gray-200 border cursor-pointer"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="data-[state=active]:bg-gray-200 border cursor-pointer"
            >
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-gray-200 border cursor-pointer"
            >
              Published
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search blogs..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <BlogSkeleton rows={7} />
      ) : blogs.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Pencil className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {searchInput || currentFilter !== "all"
                ? "No blogs match your criteria"
                : "No blogs yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchInput || currentFilter !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Get started by creating your first blog post."}
            </p>
            {!searchInput && currentFilter === "all" && (
              <Link href="/dashboard/blog-editor">
                <Button className="mt-4">Create Your First Blog</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50">
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-20">Reads</TableHead>
                  <TableHead className="w-20">Likes</TableHead>
                  <TableHead className="w-24">Comments</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="text-right w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog, index) => (
                  <TableRow
                    key={blog.id}
                    className={index % 2 === 0 ? "bg-gray-50/30" : ""}
                  >
                    <TableCell>
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={60}
                        height={40}
                        className="rounded-md object-cover h-10 w-15 border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-blog.jpg";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 truncate max-w-xs">
                          {blog.title}
                        </p>
                        {blog.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {blog.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {(blog.views || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {(blog.likes || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {(blog.comments || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/blog-editor/${blog.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link href={`/preview/${blog.id}`} target="_blank">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(blog)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * 7 + 1} to{" "}
                {Math.min(pagination.currentPage * 7, pagination.totalCount)} of{" "}
                {pagination.totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === pagination.currentPage
                              ? "default"
                              : "outline"
                          }
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ This action is permanent and cannot be undone.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You are about to permanently delete "
              <strong>{selectedBlog?.title}</strong>". This will also remove all
              associated data including likes, views, comments, and metadata.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                To confirm, type the blog slug:{" "}
                <code className="px-1 py-0.5 bg-gray-100 rounded text-red-600">
                  {selectedBlog?.slug}
                </code>
              </label>
              <Input
                placeholder="Enter blog slug to confirm"
                value={slugToConfirm}
                onChange={(e) => setSlugToConfirm(e.target.value)}
                className="border-red-200 focus:border-red-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={slugToConfirm !== selectedBlog?.slug || isDeleting}
              onClick={confirmDelete}
            >
              {isDeleting ? "Deleting..." : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
