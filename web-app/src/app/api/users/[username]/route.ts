import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;

  const { username } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let isFollowing = false;

    // if (loggedInUserId && user.id !== loggedInUserId) {
    //   const follow = await prisma.follow.findUnique({
    //     where: {
    //       followerId_followingId: {
    //         followerId: loggedInUserId,
    //         followingId: user.id,
    //       },
    //     },
    //   });

    //   isFollowing = !!follow;
    // }

    // return NextResponse.json(
    //   { success: true, user, isFollowing },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("GET /api/user/[username] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
