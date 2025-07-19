"use client";

import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { motion } from "framer-motion";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(243);
  const [tapping, setTapping] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  return (
    <div className="flex items-center gap-0 text-muted-foreground">
      <motion.div
        className="p-2 rounded-full cursor-pointer"
        animate={tapping ? { scale: 0.9 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onTapStart={() => setTapping(true)}
        onTap={() => setTapping(false)}
        onClick={toggleLike}
      >
        <HeartIcon
          className={`w-8 h-8 transition-colors duration-300 ${
            liked ? "fill-red-500 text-red-500" : "fill-none text-gray-400"
          }`}
        />
      </motion.div>

      <div className="flex items-center gap-1">
        <span className="font-medium text-base">{likeCount}</span>
        <span className="text-sm text-muted-foreground">likes</span>
      </div>
    </div>
  );
}
