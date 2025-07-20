import { Blog } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog?.slug ?? "#"}`}
      className="group rounded-xl overflow-hidden shadow-sm border bg-white dark:bg-muted hover:shadow-md transition flex flex-col font-heading"
      aria-label={blog?.title}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <Image
          src={blog?.image || "/placeholder.webp"}
          alt={blog?.title || "Blog cover image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="p-4 lg:p-6 pt-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">
            {blog?.title ?? "Untitled Blog"}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {blog?.description ?? "No description available."}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          {blog?.category && (
            <span className="text-xs text-primary font-medium uppercase">
              #{blog.category}
            </span>
          )}

          <div className="flex items-center space-x-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{blog?.likes ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{blog?.comments ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
