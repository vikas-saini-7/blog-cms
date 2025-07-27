import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Blog Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/blogs">Browse All Blogs</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
