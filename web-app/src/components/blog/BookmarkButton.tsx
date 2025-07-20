"use client";

import { useState } from "react";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

type Size = "sm" | "md" | "lg";

const sizeMap = {
  sm: { icon: 20, padding: "p-2" },
  md: { icon: 30, padding: "p-3" },
  lg: { icon: 40, padding: "p-4" },
};

interface BookmarkButtonProps {
  size?: Size;
}

export function BookmarkButton({ size = "md" }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const toggleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setBookmarked((prev) => !prev);
  };

  const { icon, padding } = sizeMap[size];

  return (
    <motion.button
      onClick={toggleBookmark}
      className={`absolute top-4 right-4 z-10 ${padding} rounded-full bg-white shadow hover:shadow-md transition cursor-pointer`}
      whileTap={{ scale: 0.7 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {bookmarked ? (
        <IconBookmarkFilled size={icon} className="text-orange-500" />
      ) : (
        <IconBookmark size={icon} className="text-gray-500" />
      )}
    </motion.button>
  );
}
