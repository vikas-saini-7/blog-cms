"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import { TagsInput } from "@/components/blog-editor/TagsInput";
import TiptapEditor from "@/components/blog-editor/TipTapEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconEye } from "@tabler/icons-react";

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
  const handleRemoveImage = () => {
    setCoverImage(null); // or however you're managing state
  };

  const handleOpenPreview = () => {
    // save as  draft first

    window.open("/preview/draft-1234", "_blank");
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
            className="w-full h-72 border-2 border-dashed flex items-center justify-center cursor-pointer rounded-md relative overflow-hidden"
          >
            {coverImage ? (
              <div className="flex w-full h-full">
                {/* Left Half - Image */}
                <div className="w-1/2 h-full relative aspect-video">
                  <Image
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                    fill
                    className="object-cover rounded-l-md"
                  />
                </div>

                {/* Right Half - Buttons */}
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
              // Default UI when no image selected
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
            <IconEye /> Preview
          </Button>
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
