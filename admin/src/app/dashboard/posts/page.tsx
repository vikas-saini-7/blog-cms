// page.tsx
import { Button } from "@/components/ui/button";
// import BlogTable from "@/components/dashboard/BlogTable";

export default function PostsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Blogs</h2>
        <Button>Create Blog</Button>
      </div>
      {/* <BlogTable /> */}
    </div>
  );
}
