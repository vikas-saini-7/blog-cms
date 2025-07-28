"use server";

import { PostStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export interface AuthorProfile {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  email: string | null;
  totalPosts: number;
  totalViews: number;
  totalFollowers: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export interface AuthorBlog {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  publishedAt: Date | null;
  views: number;
  likes: number;
  comments: number;
}

export interface AuthorBlogsFilters {
  sort?: "latest" | "popular";
  time?: "24h" | "7d" | "30d" | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuthorBlogsResponse {
  blogs: AuthorBlog[];
  hasMore: boolean;
  totalCount: number;
}

export async function getAuthorProfile(
  username: string
): Promise<AuthorProfile | null> {
  try {
    const session = await getServerSession(authOptions);

    const author = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: PostStatus.PUBLISHED,
              },
            },
            followers: true,
          },
        },
      },
    });

    if (!author) {
      return null;
    }

    // Calculate total views from all published posts
    const totalViews = await prisma.post.aggregate({
      where: {
        authorId: author.id,
        status: PostStatus.PUBLISHED,
      },
      _sum: {
        views: true,
      },
    });

    // Check if current user is following this author
    let isFollowing = false;
    let isOwnProfile = false;

    if (session?.user?.id) {
      isOwnProfile = session.user.id === author.id;

      if (!isOwnProfile) {
        const followRecord = await prisma.userFollower.findFirst({
          where: {
            followerId: session.user.id,
            followingId: author.id,
          },
        });
        isFollowing = !!followRecord;
      }
    }

    return {
      id: author.id,
      name: author.name,
      username: author.username,
      avatar: author.avatar,
      bio: author.bio,
      email: author.email,
      totalPosts: author._count.posts,
      totalViews: totalViews._sum.views || 0,
      totalFollowers: author._count.followers,
      isFollowing,
      isOwnProfile,
    };
  } catch (error) {
    console.error("Error fetching author profile:", error);
    throw new Error("Failed to fetch author profile");
  }
}

export async function getAuthorBlogs(
  username: string,
  filters: AuthorBlogsFilters = {}
): Promise<AuthorBlogsResponse> {
  try {
    const {
      sort = "latest",
      time = "all",
      search = "",
      page = 1,
      limit = 12,
    } = filters;

    // First, find the author
    const author = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!author) {
      return {
        blogs: [],
        hasMore: false,
        totalCount: 0,
      };
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      authorId: author.id,
      status: PostStatus.PUBLISHED,
    };

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
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
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const transformedBlogs = blogs.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      likes: post._count.likes,
      comments: post._count.comments,
    }));

    const hasMore = skip + blogs.length < totalCount;

    return {
      blogs: transformedBlogs,
      hasMore,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching author blogs:", error);
    throw new Error("Failed to fetch author blogs");
  }
}
