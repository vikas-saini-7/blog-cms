// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, avatarUrl, bio, gender, role, dob, tags, isPublic } =
      body;

    // ✅ Validate required fields
    if (!username || !gender || !dob || !role || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        username,
        avatar: avatarUrl,
        bio,
        DOB: new Date(dob),
        gender: gender.toUpperCase(), // must match enum key: MALE, FEMALE, OTHER
        designation: role.toUpperCase(), // must match enum key
        contentPreferences: tags.map((tag: string) =>
          tag.toUpperCase().replaceAll(" ", "_")
        ), // convert tags like "Web Development" → "WEB_DEVELOPMENT"
        isPublic,
        isOnboarded: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json(
      { error: "Server error during onboarding" },
      { status: 500 }
    );
  }
}
