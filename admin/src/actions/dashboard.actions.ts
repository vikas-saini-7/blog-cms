"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export interface DashboardStats {
  totalBlogs: number;
  followersCount: number;
  totalViews: number;
  totalLikes: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const [totalBlogs, followersCount, postsWithStats] = await Promise.all([
      prisma.post.count({
        where: { authorId: user.id },
      }),
      prisma.userFollower.count({
        where: { followingId: user.id },
      }),
      prisma.post.findMany({
        where: { authorId: user.id },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
    ]);

    const totalViews = postsWithStats.reduce(
      (sum, post) => sum + post.views,
      0
    );
    const totalLikes = postsWithStats.reduce(
      (sum, post) => sum + post._count.likes,
      0
    );

    return {
      totalBlogs,
      followersCount,
      totalViews,
      totalLikes,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
}

export interface RecentBlog {
  id: string;
  title: string;
  publishedAt: Date | null;
  views: number;
  status: string;
}

export async function getRecentBlogs(limit: number = 5): Promise<RecentBlog[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const blogs = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        publishedAt: true,
        views: true,
        status: true,
      },
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    throw new Error("Failed to fetch recent blogs");
  }
}

export interface RecentFollower {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  followedAt: Date;
}

export async function getRecentFollowers(
  limit: number = 5
): Promise<RecentFollower[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const followers = await prisma.userFollower.findMany({
      where: { followingId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return followers.map((follow) => ({
      id: follow.follower.id,
      name: follow.follower.name,
      username: follow.follower.username,
      avatar: follow.follower.avatar,
      followedAt: follow.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching recent followers:", error);
    throw new Error("Failed to fetch recent followers");
  }
}

export interface LatestComment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string | null;
    avatar: string | null;
  };
  post: {
    title: string;
    slug: string;
  };
}

export async function getLatestComments(
  limit: number = 5
): Promise<LatestComment[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const comments = await prisma.comment.findMany({
      where: {
        post: {
          authorId: user.id,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching latest comments:", error);
    throw new Error("Failed to fetch latest comments");
  }
}
