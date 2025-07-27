"use server";

import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
const prisma = new PrismaClient();

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
