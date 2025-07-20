"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Upload } from "lucide-react";
import { TagsInput } from "@/components/blog-editor/TagsInput";
import TiptapEditor from "@/components/blog-editor/TipTapEditor";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CreateBlogPage() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[300px] focus:outline-none",
      },
    },
    // 👇 This avoids hydration mismatch during SSR
    immediatelyRender: false,
  });

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = (status: "draft" | "publish") => {
    const content = editor?.getHTML();
    console.log({ title, tags, status, content, coverImage });
    // Call your API to save post here
  };

  return (
    <div className="flex w-full">
      {/* Left Side */}
      <ScrollArea className="w-full h-[calc(100vh-61px)]">
        <div className="w-full flex flex-col gap-6 py-8 px-8">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Add Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold focus:outline-none bg-transparent placeholder:text-muted-foreground font-heading"
            />
          </div>

          {/* Cover Image Upload */}
          <label
            htmlFor="coverImage"
            className="w-full h-64 border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer rounded-md relative"
          >
            {coverImage ? (
              <Image
                src={URL.createObjectURL(coverImage)}
                alt="Cover Preview"
                fill
                className="object-cover rounded-md"
              />
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

          {/* Rich Text Editor */}
          <div className="prose max-w-none">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>
      </ScrollArea>

      {/* Right Side Actions */}
      <div className="w-1/4 flex flex-col gap-6 bg-white p-6">
        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit("publish")}>Publish</Button>
        </div>
        {/* Tags */}
        <div>
          <label className="text-sm font-medium">Tags</label>
          <TagsInput value={tags} onChange={setTags} />
        </div>
      </div>
    </div>
  );
}
