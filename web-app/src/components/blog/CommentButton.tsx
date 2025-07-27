"use client";

import { MessageCircleIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CommentButtonProps {
  commentCount?: number;
}

export function CommentButton({ commentCount = 0 }: CommentButtonProps) {
  const scrollToComments = () => {
    const commentSection = document.getElementById("comments");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.button
      className="
        group inline-flex items-center gap-2 px-4 py-2.5 rounded-full
         bg-background text-muted-foreground
        hover:bg-muted hover:text-foreground hover:scale-105
        active:scale-95 transition-all duration-200 ease-out
      "
      whileTap={{ scale: 0.95 }}
      onClick={scrollToComments}
    >
      <MessageCircleIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
      <span className="text-sm font-medium">{commentCount}</span>
    </motion.button>
  );
}
