"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Reply, Search, X } from "lucide-react";

// Dummy blogs
const dummyBlogs = Array.from({ length: 10 }, (_, i) => ({
  id: `${i}`,
  title: `Blog Post ${i + 1}`,
  slug: `blog-post-${i + 1}`,
  image:
    "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
}));

// Dummy comments
const dummyComments = Array.from({ length: 30 }, (_, i) => {
  const blog = dummyBlogs[i % dummyBlogs.length];
  return {
    id: i,
    blogId: blog.id,
    blogTitle: blog.title,
    blogSlug: blog.slug,
    blogImage: blog.image,
    user: `user${i + 1}`,
    comment: `This is a comment on ${blog.title}`,
    createdAt: new Date(Date.now() - i * 1000000),
    likes: Math.floor(Math.random() * 20),
  };
});

export default function CommentsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "mostLiked">("newest");
  const [selectedComment, setSelectedComment] = useState<
    (typeof dummyComments)[0] | null
  >(null);
  const [replyText, setReplyText] = useState("");
  const [selectPostModalOpen, setSelectPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<
    (typeof dummyBlogs)[0] | null
  >(null);
  const [blogSearch, setBlogSearch] = useState("");

  const filteredComments = dummyComments
    .filter((comment) => {
      if (selectedPost && comment.blogId !== selectedPost.id) return false;
      return comment.blogTitle.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "newest")
        return b.createdAt.getTime() - a.createdAt.getTime();
      if (sort === "oldest")
        return a.createdAt.getTime() - b.createdAt.getTime();
      return b.likes - a.likes;
    });

  const filteredBlogs = dummyBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(blogSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Manage Comments</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* <Input
          placeholder="Search blog title in comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        /> */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setSelectPostModalOpen(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            {selectedPost ? "Change Blog" : "Select Blog"}
          </Button>

          {selectedPost && (
            <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded">
              <span>Showing comments for: </span>
              <span className="font-medium text-primary">
                {selectedPost.title}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedPost(null)}
                className="w-5 h-5"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={sort === "newest" ? "default" : "outline"}
            onClick={() => setSort("newest")}
          >
            Newest
          </Button>
          <Button
            variant={sort === "oldest" ? "default" : "outline"}
            onClick={() => setSort("oldest")}
          >
            Oldest
          </Button>
          <Button
            variant={sort === "mostLiked" ? "default" : "outline"}
            onClick={() => setSort("mostLiked")}
          >
            Most Liked
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-md p-4 flex items-start gap-4 bg-white"
          >
            <Image
              src={comment.blogImage}
              alt="Blog"
              width={60}
              height={60}
              className="rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center flex-wrap">
                <Link
                  href={`/blog/${comment.blogSlug}`}
                  className="text-blue-600 hover:underline font-semibold text-lg"
                  target="_blank"
                >
                  {comment.blogTitle}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {comment.user} • {formatDistanceToNow(comment.createdAt)} ago
                </span>
              </div>
              <p className="mt-2 text-gray-800">{comment.comment}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedComment(comment);
                    setReplyText("");
                  }}
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <p className="text-muted-foreground text-center">
            No comments found.
          </p>
        )}
      </div>

      {/* Reply Modal */}
      <Dialog
        open={!!selectedComment}
        onOpenChange={() => setSelectedComment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Comment</DialogTitle>
          </DialogHeader>

          {selectedComment && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Comment on{" "}
                <Link
                  href={`/blog/${selectedComment.blogSlug}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  {selectedComment.blogTitle}
                </Link>
              </p>
              <p className="bg-muted px-3 py-2 rounded text-sm">
                "{selectedComment.comment}"
              </p>
              <Textarea
                placeholder="Write your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                console.log("Replied:", replyText);
                setSelectedComment(null);
              }}
              disabled={!replyText.trim()}
            >
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Selector Modal */}
      <Dialog open={selectPostModalOpen} onOpenChange={setSelectPostModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select a Blog Post</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search blogs..."
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
          />

          <ScrollArea className="h-64 mt-3 rounded border px-2">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => {
                  setSelectedPost(blog);
                  setSelectPostModalOpen(false);
                  setSearch(""); // reset comment search
                }}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={blog.image}
                    alt="blog"
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                  <span>{blog.title}</span>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <p className="text-sm text-muted-foreground p-2">
                No blogs found.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
