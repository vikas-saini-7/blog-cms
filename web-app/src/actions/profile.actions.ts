"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";


export interface ProfileData {
  id: string;
  name: string;
  username: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  stats: {
    totalPosts: number;
    totalReads: number;
    totalFollowers: number;
  };
}

export async function getProfileData(): Promise<ProfileData | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
            followers: true,
          },
        },
        posts: {
          where: {
            status: "PUBLISHED",
          },
          select: {
            views: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const totalReads = user.posts.reduce((sum, post) => sum + post.views, 0);

    return {
      id: user.id,
      name: user.name || "",
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      stats: {
        totalPosts: user._count.posts,
        totalReads,
        totalFollowers: user._count.followers,
      },
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

export async function getUserBookmarks(userId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookmarks.map((bookmark) => ({
      id: bookmark.post.id,
      title: bookmark.post.title,
      description: bookmark.post.description,
      slug: bookmark.post.slug,
      coverImage: bookmark.post.coverImage,
      publishedAt: bookmark.post.publishedAt,
      views: bookmark.post.views,
      likes: bookmark.post._count.likes,
      comments: bookmark.post._count.comments,
      author: bookmark.post.author,
    }));
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    return [];
  }
}

export async function getUserLikes(userId: string) {
  try {
    const likes = await prisma.like.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likes.map((like) => ({
      id: like.post.id,
      title: like.post.title,
      description: like.post.description,
      slug: like.post.slug,
      coverImage: like.post.coverImage,
      publishedAt: like.post.publishedAt,
      views: like.post.views,
      likes: like.post._count.likes,
      comments: like.post._count.comments,
      author: like.post.author,
    }));
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return [];
  }
}

export async function getUserComments(userId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return [];
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      views: post.views,
      category: post.postCategories[0]?.category.slug,
      likes: post._count.likes,
      comments: post._count.comments,
      author: post.author,
      tags: post.postTags.map((pt) => pt.tag),
    }));
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}
