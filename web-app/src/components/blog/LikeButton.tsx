"use client";

import { useState, useTransition } from "react";
import { HeartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toggleLike } from "@/actions/user-interactions.actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  isLiked: boolean;
}

export function LikeButton({
  postId,
  initialLikeCount,
  isLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { data: session, status } = useSession();

  const handleToggleLike = () => {
    if (!session?.user.id) {
      toast.error("Login to like blogs");
      router.push("/auth/login");
      return;
    }
    setLiked((prev) => !prev);
    setLikeCount((count) => (liked ? count - 1 : count + 1));

    startTransition(async () => {
      await toggleLike(postId);
    });
  };

  return (
    <motion.button
      className={`
        group inline-flex items-center gap-2 px-4 py-2.5 rounded-full
        border transition-all duration-200 ease-out
        ${
          liked
            ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-800/50 dark:text-red-400"
            : "bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        }
        ${
          isPending
            ? "opacity-75 pointer-events-none"
            : "hover:scale-105 active:scale-95"
        }
      `}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (!isPending) handleToggleLike();
      }}
      disabled={isPending}
    >
      <HeartIcon
        className={`w-4 h-4 transition-all duration-200 ${
          liked ? "fill-current" : "group-hover:scale-110"
        }`}
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </motion.button>
  );
}
