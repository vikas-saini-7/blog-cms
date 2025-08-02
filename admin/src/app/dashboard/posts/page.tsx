"use client";

import { useEffect, useState } from "react";
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
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types";
import BlogSkeleton from "@/components/skeletons/BlogTableSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const POSTS_PER_PAGE = 7;
type BlogWithStatus = Blog & { status: "draft" | "published" };

export default function PostsPage() {
  const [blogs, setBlogs] = useState<BlogWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "drafts" | "published">("all");
  const [page, setPage] = useState(1);

  const [openDialog, setOpenDialog] = useState(false);
  const [slugToConfirm, setSlugToConfirm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<BlogWithStatus | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const res = await getUserBlogs();
      if (res.success && res.blogs) {
        console.log(res.blogs);
        setBlogs(
          res.blogs.map((b: any) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            image: b.coverImage || "",
            slug: b.slug,
            views: b.views,
            likes: b.likes ?? 0,
            comments: 0,
            status: b.status === "DRAFT" ? "draft" : "published",
          }))
        );
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    if (filter === "all") return true;
    return blog.status === filter;
  });

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

  const handleDeleteClick = (blog: BlogWithStatus) => {
    setSelectedBlog(blog);
    setSlugToConfirm("");
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedBlog && slugToConfirm === selectedBlog.slug) {
      setIsDeleting(true);
      const res = await deleteBlog(selectedBlog.id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
        setOpenDialog(false);
        toast.success("Blog Deleted Successfully");
      } else {
        alert(res.message || "Failed to delete blog.");
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <Link href="/dashboard/blog-editor">
          <Button>Create Blog</Button>
        </Link>
      </div>

      <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <BlogSkeleton rows={POSTS_PER_PAGE} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Reads</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover h-10 w-16"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell className="capitalize">{blog.views}</TableCell>
                  <TableCell>{blog.likes}</TableCell>
                  <TableCell>{blog.comments}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/dashboard/blog-editor/${blog.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/preview/${blog.id}`} target="_blank">
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(blog)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You are about to permanently delete the blog post{" "}
              <strong>{selectedBlog?.title}</strong>. This action is
              irreversible and will also remove{" "}
              <strong>all associated data</strong> including likes, reads,
              comments, and other metadata.
            </p>
            <p className="text-sm text-muted-foreground">
              To confirm, please type:{" "}
              <code className="px-1 py-0.5 bg-muted rounded">
                {selectedBlog?.slug}
              </code>{" "}
              below.
            </p>
            <Input
              placeholder="Enter blog slug"
              value={slugToConfirm}
              onChange={(e) => setSlugToConfirm(e.target.value)}
            />
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
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
