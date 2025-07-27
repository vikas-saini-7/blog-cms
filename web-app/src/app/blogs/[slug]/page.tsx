import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Author, Blog } from "@/types";
import BlogCard from "@/components/common/BlogCard";
import SectionTitle from "@/components/landing/SectionTitle";
import {
  CopyIcon,
  LinkedinIcon,
  RectangleVerticalIcon,
  TwitterIcon,
} from "lucide-react";
import { LikeButton } from "@/components/blog/LikeButton";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { CommentButton } from "@/components/blog/CommentButton";
import CommentsContainer from "@/components/blog/CommentsContainer";
import AddComment from "@/components/blog/AddComment";
import AuthorCard from "@/components/authors/AuthorCard";
import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { getBlogBySlug, getRelatedBlogs } from "@/actions/blog.actions";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.title,
    description:
      blog.description || `Read ${blog.title} by ${blog.author.name}`,
    openGraph: {
      title: blog.title,
      description:
        blog.description || `Read ${blog.title} by ${blog.author.name}`,
      images: blog.coverImage ? [blog.coverImage] : [],
      type: "article",
      authors: [blog.author.name],
      publishedTime: blog.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description:
        blog.description || `Read ${blog.title} by ${blog.author.name}`,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Fetch blog details
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Fetch related blogs
  const relatedBlogs = await getRelatedBlogs(blog.id, 3);

  // Transform author data to match the Author interface
  const author: Author = {
    username: blog.author.username,
    name: blog.author.name,
    avatar: blog.author.avatar,
    bio: blog.author.bio,
    isProfilePublic: true, // Default value, you may want to add this to your schema
    followersCount: 0, // Default value, you may want to add this to your schema
    isFollowing: false, // Default value, you may want to implement this logic
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight tracking-tight font-heading">
        {blog.title}
      </h1>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
          <BookmarkButton size="md" />
        </div>
      )}

      {/* Posted Date & Time */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Posted on {formatDate(blog.publishedAt)} by {blog.author.name}
        </p>
        <div className="flex items-center gap-4">
          <span>{blog.views} views</span>
          <span>{blog.likes} likes</span>
          <span>{blog.comments} comments</span>
        </div>
      </div>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <div className="flex items-center justify-center my-6 mt-12 uppercase">
        <div className="flex items-center w-full gap-4 text-center text-muted-foreground text-sm">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 whitespace-nowrap">Thanks for reading</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
      </div>

      {/* Share + Like Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl">
        {/* Like Section */}
        <div className="flex items-center gap-4">
          <LikeButton />
          <CommentButton />
        </div>

        {/* Share Buttons */}
        <ShareButtons />
      </div>

      {/* Author Info */}
      <div id="comments">
        <h1 className="text-2xl font-semibold mb-2 font-heading">Author</h1>
        <AuthorCard author={author} />
      </div>

      {/* Comments */}
      <div>
        <h3 className="text-2xl font-semibold mb-2 font-heading">Comments</h3>
        <AddComment />
        <CommentsContainer />
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mt-20">
          <SectionTitle title="Related Blogs" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog: Blog) => (
              <BlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
