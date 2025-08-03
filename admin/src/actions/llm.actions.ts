"use server";

import { getServerSession } from "next-auth";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

function parseTopics(raw: string): string[] {
  return raw
    .split("\n")
    .filter((line) => /^\d+\./.test(line))
    .map((line) =>
      line
        .replace(/^\d+\.\s*/, "") // remove "1. " prefix
        .replace(/^["“”'*_`]+|["“”'*_`]+$/g, "") // remove surrounding quotes, bold/italic/markdown
        .trim()
    );
}

export async function suggestTopics() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      bio: true,
      designation: true,
      contentPreferences: true,
      posts: {
        select: {
          title: true,
          postCategories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
          postTags: {
            select: {
              tag: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5, // Get last 5 posts for context
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Build personalized prompt
  const buildPersonalizedPrompt = () => {
    let prompt =
      "Generate 3 unique blog topic suggestions for a user with the following profile:\n\n";

    if (user.name) prompt += `Name: ${user.name}\n`;
    if (user.designation) prompt += `Role: ${user.designation}\n`;
    if (user.bio) prompt += `Bio: ${user.bio}\n`;

    if (user.contentPreferences.length > 0) {
      const preferences = user.contentPreferences.join(", ");
      prompt += `Content Interests: ${preferences}\n`;
    }

    if (user.posts.length > 0) {
      prompt += `\nRecent blog topics they've written about:\n`;
      user.posts.forEach((post, index) => {
        prompt += `${index + 1}. ${post.title}\n`;
      });

      const categories = user.posts.flatMap((post) =>
        post.postCategories.map((pc) => pc.category.name)
      );
      const uniqueCategories = [...new Set(categories)];
      if (uniqueCategories.length > 0) {
        prompt += `\nCategories they write in: ${uniqueCategories.join(
          ", "
        )}\n`;
      }

      const tags = user.posts.flatMap((post) =>
        post.postTags.map((pt) => pt.tag.name)
      );
      const uniqueTags = [...new Set(tags)];
      if (uniqueTags.length > 0) {
        prompt += `Common tags they use: ${uniqueTags
          .slice(0, 10)
          .join(", ")}\n`;
      }
    }

    prompt += `\nSuggest 3 blog topics that would be relevant to their interests and expertise, but different from what they've already written about. Focus on current trends and practical insights.`;

    return prompt;
  };

  const personalizedPrompt = buildPersonalizedPrompt();

  try {
    const res = await axios.post(
      `${process.env.LLM_API}/chat/completions`,
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content:
              "Respond only with short blog titles in a numbered list. No formatting.",
          },
          {
            role: "user",
            content: personalizedPrompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
        top_p: 0.9,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        },
      }
    );

    const raw = res.data.choices?.[0]?.message?.content || "";
    const topics = parseTopics(raw);
    console.log("topics", topics);
    return topics.length ? topics : ["No clean topics extracted."];
  } catch (err: any) {
    console.error("AI suggestion error:", err.response?.data || err.message);
    return ["Error generating suggestions."];
  }
}
