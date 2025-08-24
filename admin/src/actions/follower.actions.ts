"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getMyFollowers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "newest" | "oldest";
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {
      followingId: session.user.id,
    };

    // Add search filter
    if (params?.search) {
      whereConditions.follower = {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { username: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
        ],
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.userFollower.count({
      where: whereConditions,
    });

    // Get paginated followers
    const followers = await prisma.userFollower.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: params?.sortBy === "oldest" ? "asc" : "desc",
      },
      skip: offset,
      take: limit,
      include: {
        follower: {
          include: {
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      followers: followers.map((f) => ({
        id: f.follower.id,
        name: f.follower.name,
        username: f.follower.username || f.follower.email.split("@")[0],
        email: f.follower.email,
        avatar: f.follower.avatar,
        bio: f.follower.bio,
        followedAt: f.createdAt,
        postsCount: f.follower._count.posts,
        followersCount: f.follower._count.followers,
        followingCount: f.follower._count.following,
        designation: f.follower.designation,
        contentPreferences: f.follower.contentPreferences,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("getMyFollowers error:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function exportFollowers(format: "csv" | "json") {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const followers = await prisma.userFollower.findMany({
      where: { followingId: session.user.id },
      include: {
        follower: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const exportData = followers.map((f) => ({
      name: f.follower.name,
      email: f.follower.email,
      username: f.follower.username || f.follower.email.split("@")[0],
      designation: f.follower.designation,
      followedAt: f.createdAt.toISOString(),
      bio: f.follower.bio,
      contentPreferences: f.follower.contentPreferences.join(", "),
    }));

    if (format === "csv") {
      const headers = [
        "Name",
        "Email",
        "Username",
        "Designation",
        "Followed At",
        "Bio",
        "Content Preferences",
      ];
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          [
            `"${row.name}"`,
            `"${row.email}"`,
            `"${row.username}"`,
            `"${row.designation || ""}"`,
            `"${row.followedAt}"`,
            `"${row.bio || ""}"`,
            `"${row.contentPreferences}"`,
          ].join(",")
        ),
      ].join("\n");

      return {
        success: true as const,
        data: csvContent,
        filename: "followers.csv",
      };
    } else {
      return {
        success: true as const,
        data: JSON.stringify(exportData, null, 2),
        filename: "followers.json",
      };
    }
  } catch (error) {
    console.error("exportFollowers error:", error);
    return { success: false as const, message: "Something went wrong" };
  }
}
