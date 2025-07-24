// components/HeaderAuthSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
}
