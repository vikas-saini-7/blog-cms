"use server";

import { getServerSession } from "next-auth";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

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

  const prompt = `build prompt`;

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
            content: "Give 3 unique blog titles on modern web dev.",
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
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
