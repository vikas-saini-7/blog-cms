"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
// import History from "@tiptap/extension-history";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Undo,
  Redo,
  Quote,
  ImageIcon,
  Underline as UnderlineIcon,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallback } from "react";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Link,
      Image,
      CodeBlock,
      Blockquote,
      BulletList,
      OrderedList,
      //   History,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert min-h-[250px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: true,
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-input rounded-md overflow-hidden">
      <div className="border-b px-4 py-2 flex flex-wrap gap-2 items-center justify-start bg-white">
        <ToggleGroup type="multiple" className="gap-1">
          <ToggleGroupItem
            value="bold"
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive("bold") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("bold") ? "bg-primary text-white" : ""
            }`}
          >
            <Bold className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="italic"
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive("italic") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("italic") ? "bg-primary text-white" : ""
            }`}
          >
            <Italic className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="underline"
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-state={editor.isActive("underline") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("underline") ? "bg-primary text-white" : ""
            }`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="h1"
            aria-label="Heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            data-state={editor.isActive("heading", { level: 1 }) ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-white"
                : ""
            }`}
          >
            <Heading1 className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="h2"
            aria-label="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            data-state={editor.isActive("heading", { level: 2 }) ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-white"
                : ""
            }`}
          >
            <Heading2 className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="h3"
            aria-label="Heading 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            data-state={editor.isActive("heading", { level: 3 }) ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-primary text-white"
                : ""
            }`}
          >
            <Heading3 className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="ul"
            aria-label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive("bulletList") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("bulletList") ? "bg-primary text-white" : ""
            }`}
          >
            <List className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="ol"
            aria-label="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive("orderedList") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("orderedList") ? "bg-primary text-white" : ""
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="blockquote"
            aria-label="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            data-state={editor.isActive("blockquote") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("blockquote") ? "bg-primary text-white" : ""
            }`}
          >
            <Quote className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="codeblock"
            aria-label="Code Block"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            data-state={editor.isActive("codeBlock") ? "on" : "off"}
            className={`rounded px-2 py-1 ${
              editor.isActive("codeBlock") ? "bg-primary text-white" : ""
            }`}
          >
            <Code className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="image"
            aria-label="Insert Image"
            onClick={addImage}
            className="rounded px-2 py-1"
          >
            <ImageIcon className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="undo"
            aria-label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            className="rounded px-2 py-1"
          >
            <Undo className="w-4 h-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="redo"
            aria-label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            className="rounded px-2 py-1"
          >
            <Redo className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
