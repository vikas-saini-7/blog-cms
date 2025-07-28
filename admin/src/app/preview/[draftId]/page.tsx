import { notFound } from "next/navigation";
import Image from "next/image";
import { getDraftById } from "@/actions/blog.actions";

type Props = {
  params: { draftId: string };
};

export default async function BlogPreviewPage({ params }: Props) {
  const draft = await getDraftById(params.draftId);

  if (!draft) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight font-heading">
        {draft.title}
      </h1>

      <div className="w-full aspect-video relative rounded-2xl overflow-hidden bg-gray-200">
        <Image
          src={draft.coverImage || "/fallback.jpg"}
          alt="Cover Image"
          fill
          className="object-cover"
        />
      </div>
      {/* {draft.publishedAt && (
        <p className="text-muted-foreground text-sm">
          Posted on{" "}
          {draft.publishedAt.toLocaleString("en-US", {
            month: "long", // Full month name
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      )} */}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p className="text-muted-foreground text-sm">
          Posted on Month DD, YYYY • 00:00 AM/PM
        </p>
        <div className="flex items-center gap-4">
          <span>0 views</span>
          <span>0 likes</span>
          <span>0 comments</span>
        </div>
      </div>

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
    </div>
  );
}
