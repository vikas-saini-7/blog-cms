"use client";

import { useState } from "react";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

export function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);
  const toggleBookmark = () => setBookmarked((prev) => !prev);

  return (
    <motion.button
      onClick={toggleBookmark}
      className="absolute top-4 right-4 z-10 p-4 rounded-full bg-white shadow hover:shadow-md transition cursor-pointer"
      whileTap={{ scale: 0.5 }}
      title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {bookmarked ? (
        <IconBookmarkFilled size={30} className="text-orange-500" />
      ) : (
        <IconBookmark size={30} className="text-gray-500" />
      )}
    </motion.button>
  );
}
