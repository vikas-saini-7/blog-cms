// page.tsx
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import RichEditor from "@/components/dashboard/RichEditor";

export default function CreatePostPage() {
  return (
    <div className="space-y-4">
      <Input placeholder="Blog Title" />
      <Input type="file" />
      {/* <RichEditor /> */}
      <Input placeholder="Tags (comma separated)" />
      <div className="flex gap-2">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish</Button>
      </div>
    </div>
  );
}
