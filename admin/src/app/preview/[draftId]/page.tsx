// app/dashboard/posts/preview/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
// import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { Author } from "@/types";
// import AuthorCard from "@/components/authors/AuthorCard";
// import SectionTitle from "@/components/landing/SectionTitle";
// import BlogCard from "@/components/blogs/BlogCard";

// Mock placeholder for preview (replace with real fetch logic)
async function getDraftById(id: string) {
  // Replace with fetch from DB or Redis or draft store
  return {
    title: "Draft Blog Title",
    coverImage:
      "https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/67487fcf3b716cd0bc6d3f00_blog_cover_23.webp",
    content: `<p>This is the draft blog content with <strong>rich HTML</strong>.</p>`,
    createdAt: new Date(),
    author: {
      username: "vikas_saini",
      name: "Vikas Saini",
      avatarUrl:
        "https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png",
      bio: "Full Stack Developer with a passion for clean UI and scalable systems.",
      isProfilePublic: true,
      followersCount: 3439,
      isFollowing: false,
    },
    relatedBlogs: [],
  };
}

type Props = {
  params: { id: string };
};

export default async function BlogPreviewPage({ params }: Props) {
  const draft = await getDraftById(params.id);

  if (!draft) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight tracking-tight font-heading">
        {draft.title}
      </h1>

      {/* Cover Image */}
      <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
        <Image
          src={draft.coverImage}
          alt="Cover Image"
          fill
          className="object-cover"
        />
        {/* <BookmarkButton size="md" /> */}
      </div>

      {/* Date */}
      <p className="text-muted-foreground text-sm">
        Posted on Month DD, YYYY • 00:00 AM/PM
      </p>

      {/* Rich Content */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: draft.content }}
      />

      <div className="flex items-center justify-center my-6 mt-12 uppercase">
        <div className="flex items-center w-full gap-4 text-center text-muted-foreground text-sm">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 whitespace-nowrap">Thanks For Reading</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
      </div>

      {/* Author */}
      {/* <div>
        <h1 className="text-2xl font-semibold mb-2 font-heading">Author</h1>
        <AuthorCard author={draft.author as Author} />
      </div> */}

      {/* Related (optional placeholder) */}
      {/* {draft.relatedBlogs?.length > 0 && (
        <div className="mt-20">
          <SectionTitle title="Related Blogs" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {draft.relatedBlogs.map((blog, idx) => (
              <BlogCard key={idx} blog={blog} />
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
