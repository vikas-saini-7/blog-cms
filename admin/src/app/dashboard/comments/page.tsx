// page.tsx
// import CommentList from "@/components/dashboard/CommentList";
import { Input } from "@/components/ui/input";
// import { Select, SelectItem } from "@/components/ui/select";

export default function CommentsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input placeholder="Search by Blog Title..." />
      {/* <Select>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="most-liked">Most Liked</SelectItem>
      </Select>
      <CommentList /> */}
    </div>
  );
}
