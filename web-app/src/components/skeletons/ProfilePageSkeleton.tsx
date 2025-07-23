// components/skeletons/ProfilePageSkeleton.tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full h-40 bg-gradient-to-tr from-gray-200 to-gray-100 border-b" />

      {/* Profile Card Skeleton */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </Card>
      </div>

      {/* Layout Skeleton */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-52 space-y-2 text-sm font-medium">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </aside>

        {/* Content Area Skeleton */}
        <main className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </main>
      </div>
    </div>
  );
}
