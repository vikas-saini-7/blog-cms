"use client";

import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function CommentButton() {
  const [commentCount, setCommentCount] = useState(56);
  const [tapping, setTapping] = useState(false);

  const scrollToComments = () => {
    const commentSection = document.getElementById("comments");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-0 text-muted-foreground">
      <motion.div
        className="p-2 rounded-full cursor-pointer"
        animate={tapping ? { scale: 0.9 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onTapStart={() => setTapping(true)}
        onTap={() => setTapping(false)}
        onClick={scrollToComments}
      >
        <MessageCircleIcon className="w-8 h-8 text-gray-500" />
      </motion.div>

      <div className="flex items-center gap-1">
        <span className="font-medium text-base">{commentCount}</span>
        <span className="text-sm text-muted-foreground">comments</span>
      </div>
    </div>
  );
}
