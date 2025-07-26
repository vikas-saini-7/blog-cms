"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PostStatus, PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function createBlog(form: {
  title: string;
  content: string;
  status: "draft" | "publish";
  tags?: string[];
  coverUrl?: string;
  description?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const slug = slugify(form.title, { lower: true, strict: true });

    const post = await prisma.post.create({
      data: {
        title: form.title,
        content: form.content,
        slug,
        status:
          form.status === "publish" ? PostStatus.PUBLISHED : PostStatus.DRAFT,
        coverImage: form.coverUrl,
        description: form.description || "",
        authorId: session.user.id,
        publishedAt: form.status === "publish" ? new Date() : undefined,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, post };
  } catch (error) {
    console.error("createBlog error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

export async function updateBlog(
  blogId: string,
  form: {
    title: string;
    content: string;
    status: "draft" | "publish";
    tags?: string[];
    coverUrl?: string;
    description?: string;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const slug = slugify(form.title, { lower: true, strict: true });

    const post = await prisma.post.update({
      where: {
        id: blogId,
        authorId: session.user.id,
      },
      data: {
        title: form.title,
        content: form.content,
        slug,
        status:
          form.status === "publish" ? PostStatus.PUBLISHED : PostStatus.DRAFT,

        coverImage: form.coverUrl,
        description: form.description || "",
        publishedAt: form.status === "publish" ? new Date() : undefined,
      },
    });

    revalidatePath(`/blog-editor/${blogId}`);
    return { success: true, post };
  } catch (error) {
    console.error("updateBlog error:", error);
    return { success: false, error: "Something went wrong." };
  }
}
