"use server";

import { PostStatus, PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

export interface BlogFilters {
  tag?: string;
  sort?: "latest" | "popular";
  time?: "24h" | "7d" | "30d" | "all";
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  blogs: Array<{
    id: string;
    title: string;
    description: string | null;
    slug: string;
    coverImage: string | null;
    publishedAt: Date | null;
    views: number;
    category?: string;
    likes: number;
    comments: number;
    author: {
      id: string;
      name: string;
      username: string | null;
      avatar: string | null;
    };
  }>;
  hasMore: boolean;
  totalCount: number;
}

export async function fetchBlogs(
  filters: BlogFilters = {}
): Promise<BlogResponse> {
  try {
    const {
      tag = "",
      sort = "latest",
      time = "all",
      page = 1,
      limit = 12,
    } = filters;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    };

    // Filter by tag if provided
    if (tag) {
      where.postTags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    // Filter by time if not 'all'
    if (time !== "all") {
      const now = new Date();
      let timeFilter: Date;

      switch (time) {
        case "24h":
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(0);
      }

      where.publishedAt = {
        gte: timeFilter,
      };
    }

    // Build orderBy clause
    let orderBy: any = {};
    if (sort === "latest") {
      orderBy = { publishedAt: "desc" };
    } else if (sort === "popular") {
      orderBy = { views: "desc" };
    }

    // Fetch blogs with pagination
    const [blogs, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          postTags: {
            include: {
              tag: true,
            },
          },
          postCategories: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Transform the data to match the expected Blog interface
    const transformedBlogs = blogs.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      category: post.postCategories[0]?.category.slug,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
    }));

    const hasMore = skip + blogs.length < totalCount;

    return {
      blogs: transformedBlogs,
      hasMore,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
}

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}

export interface BlogDetail {
  id: string;
  title: string;
  content: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | null;
  views: number;
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
    bio: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isBookmarked: boolean;
  isLiked: boolean;
}

export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: PostStatus.PUBLISHED,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    let isBookmarked = false;
    let isLiked = false;
    const userEmail = session?.user?.email;

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      if (user) {
        const bookmark = await prisma.bookmark.findFirst({
          where: { userId: user.id, postId: post.id },
        });

        const like = await prisma.like.findFirst({
          where: { userId: user.id, postId: post.id },
        });

        isBookmarked = !!bookmark;
        isLiked = !!like;
      }
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views + 1, // Include the incremented view
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
      tags: post.postTags.map((pt) => pt.tag),
      categories: post.postCategories.map((pc) => pc.category),
      isBookmarked,
      isLiked,
    };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw new Error("Failed to fetch blog");
  }
}

export async function getRelatedBlogs(
  currentBlogId: string,
  limit: number = 3
) {
  try {
    // First, get the current blog's tags and categories
    const currentBlog = await prisma.post.findUnique({
      where: { id: currentBlogId },
      include: {
        postTags: { include: { tag: true } },
        postCategories: { include: { category: true } },
      },
    });

    if (!currentBlog) {
      return [];
    }

    const tagIds = currentBlog.postTags.map((pt) => pt.tagId);
    const categoryIds = currentBlog.postCategories.map((pc) => pc.categoryId);

    // Find related blogs based on shared tags or categories
    const relatedBlogs = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: currentBlogId } },
          { status: PostStatus.PUBLISHED },
          {
            OR: [
              {
                postTags: {
                  some: {
                    tagId: { in: tagIds },
                  },
                },
              },
              {
                postCategories: {
                  some: {
                    categoryId: { in: categoryIds },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return relatedBlogs.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      category: post.postCategories[0]?.category.slug,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
    }));
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    throw new Error("Failed to fetch related blogs");
  }
}

export interface LandingBlog {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | null;
  views: number;
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  category?: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export async function getFeaturedBlogs(
  limit: number = 6
): Promise<LandingBlog[]> {
  try {
    const blogs = await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return blogs.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
      category: post.postCategories[0]?.category.slug,
      tags: post.postTags.map((pt: any) => pt.tag),
    }));
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
}

export async function getPopularBlogs(
  limit: number = 8
): Promise<LandingBlog[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const blogs = await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        publishedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return blogs.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
      category: post.postCategories[0]?.category.slug,
      tags: post.postTags.map((pt: any) => pt.tag),
    }));
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    return [];
  }
}

export async function getBlogsByTag(
  tagSlug: string,
  limit: number = 6
): Promise<LandingBlog[]> {
  try {
    const blogs = await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        postTags: {
          some: {
            tag: {
              slug: tagSlug,
            },
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return blogs.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
      category: post.postCategories[0]?.category.slug,
      tags: post.postTags.map((pt: any) => pt.tag),
    }));
  } catch (error) {
    console.error(`Error fetching blogs by tag ${tagSlug}:`, error);
    return [];
  }
}

export async function getTrendingTags(limit: number = 6) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            postTags: {
              where: {
                post: {
                  status: PostStatus.PUBLISHED,
                },
              },
            },
          },
        },
      },
      orderBy: {
        postTags: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.postTags,
    }));
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return [];
  }
}
