// components/HeaderAuthSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-24 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
}
