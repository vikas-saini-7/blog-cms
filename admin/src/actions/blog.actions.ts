"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PostStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

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
  categories?: string[];
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

    // Handle tags - create if they don't exist
    if (form.tags && form.tags.length > 0) {
      await Promise.all(
        form.tags.map(async (tagName) => {
          let tag = await prisma.tag.findUnique({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: {
                name: tagName,
                slug: slugify(tagName, { lower: true, strict: true }),
              },
            });
          }

          return prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        })
      );
    }

    // Handle categories
    if (form.categories && form.categories.length > 0) {
      const categoryConnections = await Promise.all(
        form.categories.map(async (categoryName) => {
          const category = await prisma.category.findUnique({
            where: { name: categoryName },
          });
          if (category) {
            return prisma.postCategory.create({
              data: {
                postId: post.id,
                categoryId: category.id,
              },
            });
          }
        })
      );
    }

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
      include: {
        postCategories: {
          include: {
            category: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!blog) {
      return { success: false, message: "Blog not found" };
    }

    const blogWithCategoriesAndTags = {
      ...blog,
      categories: blog.postCategories.map((pc) => pc.category.name),
      tags: blog.postTags.map((pt) => pt.tag.name),
    };

    return { success: true, blog: blogWithCategoriesAndTags };
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
    categories?: string[];
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

    // Handle tags - remove existing and add new ones
    await prisma.postTag.deleteMany({
      where: { postId: blogId },
    });

    if (form.tags && form.tags.length > 0) {
      await Promise.all(
        form.tags.map(async (tagName) => {
          let tag = await prisma.tag.findUnique({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: {
                name: tagName,
                slug: slugify(tagName, { lower: true, strict: true }),
              },
            });
          }

          return prisma.postTag.create({
            data: {
              postId: blogId,
              tagId: tag.id,
            },
          });
        })
      );
    }

    // Handle categories - remove existing and add new ones
    await prisma.postCategory.deleteMany({
      where: { postId: blogId },
    });

    if (form.categories && form.categories.length > 0) {
      const categoryConnections = await Promise.all(
        form.categories.map(async (categoryName) => {
          const category = await prisma.category.findUnique({
            where: { name: categoryName },
          });
          if (category) {
            return prisma.postCategory.create({
              data: {
                postId: blogId,
                categoryId: category.id,
              },
            });
          }
        })
      );
    }

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

export async function deleteBlog(blogId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Ensure only the owner can delete
    const blog = await prisma.post.findUnique({
      where: { id: blogId },
    });

    if (!blog || blog.authorId !== session.user.id) {
      return { success: false, message: "Not authorized or blog not found" };
    }

    // Delete all related records first
    await prisma.comment.deleteMany({ where: { postId: blogId } });
    await prisma.like.deleteMany({ where: { postId: blogId } });
    await prisma.bookmark.deleteMany({ where: { postId: blogId } });
    await prisma.postTag.deleteMany({ where: { postId: blogId } });
    await prisma.postCategory.deleteMany({ where: { postId: blogId } });

    await prisma.post.delete({
      where: { id: blogId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("deleteBlog error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
