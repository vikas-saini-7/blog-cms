import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // const blog = await prisma.blog.findUnique({
    //   where: {
    //     id: params.id,
    //     status: "published",
    //   },
    // });

    // if (!blog) {
    //   return NextResponse.json(
    //     { success: false, error: "Blog not found" },
    //     { status: 404 }
    //   );
    // }

    // return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
