"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types";

interface BlogSwiperProps {
  blogs: Blog[];
}

const BlogSwiper: React.FC<BlogSwiperProps> = ({ blogs }) => {
  return (
    <div className="w-full mb-20">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Autoplay, Pagination]}
        className="pb-12"
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
      >
        {blogs.map((blog, idx) => (
          <SwiperSlide key={idx}>
            <Link href={`/blogs/${blog.slug}`} className="group block h-full">
              <div className="mb-16 bg-card border border-muted rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[420px]">
                <div className="relative w-full aspect-video">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 max-h-[200px] max-w-xl"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2 mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {blog.description}
                  </p>
                  <div className="mt-auto">
                    <span className="text-sm text-primary font-medium hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogSwiper;
