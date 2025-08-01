import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Title Skeleton */}
      <Skeleton className="h-12 w-3/4" />

      {/* Cover Image Skeleton */}
      <Skeleton className="w-full aspect-video rounded-2xl" />

      {/* Date and Stats Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="my-6">
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Thanks for reading divider */}
      <div className="flex items-center justify-center my-6">
        <div className="flex items-center w-full gap-4">
          <div className="flex-grow border-t border-gray-300" />
          <Skeleton className="h-4 w-32" />
          <div className="flex-grow border-t border-gray-300" />
        </div>
      </div>

      {/* Interaction buttons skeleton */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Author skeleton */}
      <div>
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Comments skeleton */}
      <div>
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      {/* Related blogs skeleton */}
      <div className="mt-20">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
