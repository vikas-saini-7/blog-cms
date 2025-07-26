"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PostStatus, PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const prisma = new PrismaClient();

function generateUniqueSlug(baseSlug: string, index?: number) {
  return index ? `${baseSlug}-${index}` : baseSlug;
}

async function findUniqueSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let index = 1;

  while (
    await prisma.post.findUnique({
      where: { slug: uniqueSlug },
    })
  ) {
    uniqueSlug = generateUniqueSlug(baseSlug, index++);
  }

  return uniqueSlug;
}

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

    const slug = await findUniqueSlug(form.title);

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

export async function getBlogById(blogId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const blog = await prisma.post.findFirst({
      where: {
        id: blogId,
        authorId: session.user.id,
      },
    });

    if (!blog) {
      return { success: false, message: "Blog not found" };
    }
    console.log(blog);

    return { success: true, blog };
  } catch (error) {
    console.error("getBlogById error:", error);
    return { success: false, message: "Something went wrong" };
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

    const slug = await findUniqueSlug(form.title);

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

export async function getDraftById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return null;

    return {
      title: post.title,
      coverImage: post.coverImage,
      content: post.content,
      publishedAt: post.publishedAt,
      relatedBlogs: [], // You can replace with actual logic later
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
    return null;
  }
}

export async function getUserBlogs() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const blogs = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, blogs };
  } catch (error) {
    console.error("getUserBlogs error:", error);
    return { success: false, message: "Something went wrong" };
  }
}