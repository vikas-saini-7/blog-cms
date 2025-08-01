"use client";

import { useTransition, useState } from "react";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconLoader2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { toggleBookmark } from "@/actions/user-interactions.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Size = "sm" | "md" | "lg";

const sizeMap = {
  sm: { icon: 20, padding: "p-2" },
  md: { icon: 30, padding: "p-3" },
  lg: { icon: 40, padding: "p-4" },
};

interface BookmarkButtonProps {
  size?: Size;
  postId: string;
  isBookmarked: boolean;
  onToggle?: (bookmarked: boolean) => void; // NEW
}

export function BookmarkButton({
  size = "md",
  postId,
  isBookmarked,
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isPending, startTransition] = useTransition();
  const { icon, padding } = sizeMap[size];
  const router = useRouter();

  const { data: session, status } = useSession();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(() => {
      if (!session?.user.id) {
        toast.error("Login to bookmark blogs");
        router.push("/auth/login");
        return;
      }
      toggleBookmark(postId)
        .then(() => {
          setBookmarked((prev) => {
            const newState = !prev;
            onToggle?.(newState); // Notify parent
            return newState;
          });
          toast.success(!bookmarked ? "Bookmark added" : "Bookmark removed");
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <motion.button
      onClick={handleToggle}
      aria-label={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className={`absolute top-4 right-4 z-10 ${padding} rounded-full bg-white shadow hover:shadow-md transition cursor-pointer flex items-center justify-center ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
      whileTap={{ scale: 0.7 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      disabled={isPending}
    >
      {isPending ? (
        <IconLoader2 size={icon} className="animate-spin text-gray-400" />
      ) : bookmarked ? (
        <IconBookmarkFilled size={icon} className="text-orange-500" />
      ) : (
        <IconBookmark size={icon} className="text-gray-500" />
      )}
    </motion.button>
  );
}
