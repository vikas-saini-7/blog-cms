import React from "react";
import BlogCardSkeleton from "../skeletons/BlogCardSkeleton";

const BlogSwiperSkeleton = () => {
  return (
    <div className="w-full mb-20">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="w-full">
            <BlogCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSwiperSkeleton;