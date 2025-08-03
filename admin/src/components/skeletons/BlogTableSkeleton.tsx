import { Skeleton } from "@/components/ui/skeleton";

interface BlogTableSkeletonProps {
  rows?: number;
}

export default function BlogTableSkeleton({
  rows = 7,
}: BlogTableSkeletonProps) {
  return (
    <div className="space-y-4 bg-white">
      {/* Table */}
      <div className="overflow-hidden">
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 items-center px-4 py-3 border-t"
          >
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-5 w-16 rounded" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
