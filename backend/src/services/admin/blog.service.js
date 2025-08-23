const slugify = require("slugify");
const prisma = require("@/lib/prisma");
const { PostStatus } = require("@/generated/prisma");
const { findUniqueSlug } = require("@/utils/utils");

exports.createBlog = async ({
  title,
  coverUrl,
  description,
  status,
  content,
  categories,
  tags,
  userId,
}) => {
  // validations
  if (!title || !content) {
    throw new Error("Missing required fields");
  }

  const slug = await findUniqueSlug(title);

  const blog = await prisma.post.create({
    data: {
      title,
      slug,
      coverImage: coverUrl,
      description: description || "",
      status: status === "publish" ? PostStatus.PUBLISHED : PostStatus.DRAFT,
      content,
      categories,
      tags,
      authorId: userId,
    },
  });

  // Handle tags - create if they don't exist
  if (tags && tags.length > 0) {
    await Promise.all(
      tags.map(async (tagName) => {
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
  if (categories && categories.length > 0) {
    const categoryConnections = await Promise.all(
      categories.map(async (categoryName) => {
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

  return blog;
};

exports.updateBlog = async (
  blogId,
  { title, coverUrl, description, status, content, categories, tags }
) => {
  // Fetch the existing blog
  const existingBlog = await prisma.post.findUnique({
    where: { id: blogId },
    include: { categories: true, tags: true },
  });

  if (!existingBlog) {
    throw new Error("Blog not found");
  }

  // Prepare updated data
  const updatedData = {
    title: title || existingBlog.title,
    coverImage: coverUrl || existingBlog.coverImage,
    description: description || existingBlog.description,
    status: status
      ? status === "publish"
        ? PostStatus.PUBLISHED
        : PostStatus.DRAFT
      : existingBlog.status,
    content: content || existingBlog.content,
  };

  // Update the blog
  const updatedBlog = await prisma.post.update({
    where: { id: blogId },
    data: updatedData,
  });

  // Update categories if provided
  if (categories) {
    // Remove existing categories
    await prisma.postCategory.deleteMany({ where: { postId: blogId } });

    // Add new categories
    await Promise.all(
      categories.map(async (categoryName) => {
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

  // Update tags if provided
  if (tags) {
    // Remove existing tags
    await prisma.postTag.deleteMany({ where: { postId: blogId } });

    // Add new tags
    await Promise.all(
      tags.map(async (tagName) => {
        let tag = await prisma.tag.findUnique({ where: { name: tagName } });
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

  return updatedBlog;
};

exports.getPreviewBlog = async (blogId) => {
  const blog = await prisma.post.findUnique({
    where: { id: blogId },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  return blog;
};

exports.listBlogs = async ({ page = 1, limit = 10, status, search }) => {
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = {};

  // Add status filter
  if (status && status !== "all") {
    whereConditions.status =
      status === "draft" ? PostStatus.DRAFT : PostStatus.PUBLISHED;
  }

  // Add search filter
  if (search) {
    whereConditions.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count for pagination
  const totalCount = await prisma.post.count({
    where: whereConditions,
  });

  // Get paginated blogs
  const blogs = await prisma.post.findMany({
    where: whereConditions,
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    blogs: blogs.map((blog) => ({
      ...blog,
      likesCount: blog._count.likes,
      commentsCount: blog._count.comments,
    })),
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

exports.deleteBlog = async ({ blogId, userId }) => {
  // Check if the blog exists
  const existingBlog = await prisma.post.findUnique({
    where: { id: blogId },
  });

  if (!existingBlog) {
    throw new Error("Blog not found");
  }

  // Optional: Check authorization if userId is provided
  if (userId && existingBlog.authorId !== userId) {
    throw new Error("Not authorized to delete this blog");
  }

  // Delete all related records first to avoid foreign key constraints
  await prisma.comment.deleteMany({ where: { postId: blogId } });
  await prisma.like.deleteMany({ where: { postId: blogId } });
  await prisma.bookmark.deleteMany({ where: { postId: blogId } });
  await prisma.postCategory.deleteMany({ where: { postId: blogId } });
  await prisma.postTag.deleteMany({ where: { postId: blogId } });

  // Delete the blog
  await prisma.post.delete({
    where: { id: blogId },
  });

  return true;
};
