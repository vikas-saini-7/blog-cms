"use client";
import BlogEditor from "@/components/blog-editor/BlogEditor";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();
  const blogId = params.blogId as string;
  return <BlogEditor blogId={blogId} />;
};

export default Page;
