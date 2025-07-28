"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function toggleBookmark(postId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }
  const existing = await prisma.bookmark.findFirst({
    where: { userId: session.user.id, postId },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  // Optional: revalidate to show updated state
  //   revalidatePath(`/blog/${postId}`);
}

export async function toggleLike(postId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }
  const existing = await prisma.like.findFirst({
    where: { userId: session.user.id, postId },
  });

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  // Optional: revalidate to show updated state
  //   revalidatePath(`/blog/${postId}`);
}

export async function toggleFollow(targetUserId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Not authenticated" };
  }

  if (session.user.id === targetUserId) {
    return { success: false, error: "Cannot follow yourself" };
  }

  try {
    const existing = await prisma.userFollower.findFirst({
      where: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });

    if (existing) {
      await prisma.userFollower.delete({
        where: { id: existing.id },
      });
      return { success: true, isFollowing: false };
    } else {
      await prisma.userFollower.create({
        data: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      });
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false, error: "Failed to toggle follow" };
  }
}
