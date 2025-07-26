"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import { TagsInput } from "@/components/blog-editor/TagsInput";
import TiptapEditor from "@/components/blog-editor/TipTapEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconEye } from "@tabler/icons-react";
import { toast } from "sonner";
import { createBlog, updateBlog, getBlogById } from "@/actions/blog.actions";
import { useRouter } from "next/navigation";

interface BlogEditorProps {
  blogId?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  // Load blog details on mount
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      setLoading(true);
      const res = await getBlogById(blogId);
      if (res.success && res.blog) {
        const blog = res.blog;
        setTitle(blog.title);
        setContent(blog.content);
        // setTags(blog.tags || []);
        setCoverUrl(blog.coverImage || "");
        setContent(blog.content);
      } else {
        toast.error(res.message || "Failed to fetch blog");
      }
      setLoading(false);
    };

    fetchBlog();
  }, [blogId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
      setCoverUrl(""); // reset URL since we are uploading a new one
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverUrl("");
  };

  const handleCreateBlog = async (status: "draft" | "publish") => {
    try {
      if (!title || !content) {
        toast.error("Title and content are required");
        return;
      }

      const res = await createBlog({
        title,
        tags,
        status,
        content,
        coverUrl,
      });

      if (res.success) {
        toast.success("Saved Successfully");
        router.push(`/dashboard/blog-editor/${res?.post?.id}`);
      } else {
        toast.error("Failed to save");
      }
    } catch (error) {
      console.error("handleCreateBlog error:", error);
      toast.error("Failed to save try again");
    }
  };

  const handleUpdateBlog = async (status: "draft" | "publish") => {
    try {
      if (!blogId) {
        toast.error("NO BLOG ID");
        return;
      }

      if (!title || !content) {
        toast.error("Title and content are required");
        return;
      }

      const res = await updateBlog(blogId, {
        title,
        tags,
        status,
        content,
        coverUrl,
      });

      if (res.success) {
        toast.success("Updated Successfully");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error("handleUpdateBlog error:", error);
      toast.error("Update failed");
    }
  };

  const handleSubmit = (status: "draft" | "publish") => {
    if (!blogId) {
      handleCreateBlog(status);
    } else {
      handleUpdateBlog(status);
    }
  };

  const handleOpenPreview = () => {
    if (!blogId) return;
    window.open(`/preview/${blogId}`, "_blank");
  };

  return (
    <div className="flex w-full">
      <ScrollArea className="w-full h-[calc(100vh-61px)]">
        <div className="w-full flex flex-col gap-6 py-8 px-8">
          <input
            type="text"
            placeholder="Add Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold focus:outline-none bg-transparent placeholder:text-muted-foreground font-heading"
          />

          {/* Cover Image Upload */}
          <label
            htmlFor="coverImage"
            className="w-full h-72 border-2 border-dashed flex items-center justify-center cursor-pointer rounded-md relative overflow-hidden"
          >
            {coverImage || coverUrl ? (
              <div className="flex w-full h-full">
                <div className="w-1/2 h-full relative aspect-video">
                  <Image
                    src={
                      coverImage ? URL.createObjectURL(coverImage) : coverUrl
                    }
                    alt="Cover Preview"
                    fill
                    className="object-cover rounded-l-md"
                  />
                </div>

                <div className="w-1/2 h-full flex flex-col">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="h-1/2 w-full bg-red-100 text- hover:bg-red-300 hover:underline cursor-pointer rounded-tr-md transition-all duration-200"
                  >
                    Remove Cover Image
                  </button>
                  <label
                    htmlFor="coverImage"
                    className="h-1/2 w-full bg-muted text-center flex items-center hover:underline cursor-pointer justify-center hover:bg-white rounded-br-md transition-all duration-200"
                  >
                    Change Cover Image
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <Upload className="w-6 h-6 mb-2" />
                <p>Click to upload cover image</p>
              </div>
            )}

            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Editor */}
          <div className="prose max-w-none">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>
      </ScrollArea>

      {/* Sidebar */}
      <div className="w-1/4 flex flex-col gap-6 bg-white p-6">
        <div className="flex flex-col gap-2">
          <Button onClick={() => handleSubmit("publish")}>Publish</Button>
          <Button variant="outline" onClick={() => handleSubmit("draft")}>
            Save as Draft
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium">Preview</label>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleOpenPreview}
          >
            <IconEye className="mr-2" /> Preview
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium">Tags</label>
          <TagsInput value={tags} onChange={setTags} />
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
