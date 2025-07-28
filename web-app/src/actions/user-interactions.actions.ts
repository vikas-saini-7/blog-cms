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
