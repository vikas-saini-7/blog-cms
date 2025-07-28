"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getAllCategories() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const categories = await prisma.category.findMany();

    // if (!blog) {
    //   return { success: false, message: "Blog not found" };
    // }
    // console.log(blog);

    return { success: true, categories };
  } catch (error) {
    console.error("getBlogById error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
