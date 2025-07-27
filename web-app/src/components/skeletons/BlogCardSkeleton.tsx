import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-48 w-full" />

      <div className="p-4 space-y-3">
        {/* Title Skeleton - single line */}
        <Skeleton className="h-6 w-4/5" />

        {/* Description Skeleton - single line */}
        <Skeleton className="h-4 w-full" />

        {/* Stats Row Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}
