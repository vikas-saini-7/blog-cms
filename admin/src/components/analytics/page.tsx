import {
  Eye,
  ThumbsUp,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const topBlogs = [
  {
    title: "Mastering React Server Components",
    views: 1200,
    likes: 320,
    comments: 45,
    daysAgo: 4,
  },
  {
    title: "Design Systems with Tailwind CSS",
    views: 950,
    likes: 210,
    comments: 30,
    daysAgo: 7,
  },
  {
    title: "Next.js 14 App Router Deep Dive",
    views: 1500,
    likes: 480,
    comments: 60,
    daysAgo: 2,
  },
];

export function TopPerformingBlogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topBlogs.map((blog, index) => (
            <div
              key={index}
              className="border rounded-md p-4 shadow-sm hover:bg-muted/40 transition"
            >
              <p className="text-base font-medium mb-2">{blog.title}</p>
              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{blog.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{blog.daysAgo} days ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
