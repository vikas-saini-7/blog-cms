"use client";
import BlogEditor from "@/components/blog-editor/BlogEditor";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const blogId = params.blogId as string;
  return <BlogEditor blogId={blogId} />;
};

export default page;
