import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // const blogs = await prisma.blog.findMany({
    //   where: {
    //     createdBy: session.user.id,
    //     status: "published",
    //   },
    // });

    // return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
