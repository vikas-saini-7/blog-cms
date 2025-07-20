"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Blog } from "@/types"; // Adjust if needed

type BlogWithStatus = Blog & { status: "draft" | "published" };

const dummyBlogs: BlogWithStatus[] = Array.from({ length: 23 }, (_, i) => ({
  id: `${i}`,
  title: `Blog Post ${i + 1}`,
  description: `This is blog post ${i + 1}.`,
  image:
    "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
  slug: `blog-post-${i + 1}`,
  category: "tech",
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 10),
  status: i % 2 === 0 ? "draft" : "published",
}));

const POSTS_PER_PAGE = 7;

const PostsPage = () => {
  const [filter, setFilter] = useState<"all" | "drafts" | "published">("all");
  const [page, setPage] = useState(1);

  const filteredBlogs = dummyBlogs.filter((blog) => {
    if (filter === "all") return true;
    return blog.status === filter;
  });

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBlogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="capitalize">{blog.category}</TableCell>
              <TableCell>{blog.likes ?? 0}</TableCell>
              <TableCell>{blog.comments ?? 0}</TableCell>
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
                <Link href={`/dashboard/posts/edit/${blog.id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/blog/${blog.slug}`} target="_blank">
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="destructive" size="icon">
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
    </div>
  );
};

export default PostsPage;
