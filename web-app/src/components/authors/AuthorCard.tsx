import { Author } from "@/types";
import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthorCardProps {
  author: Author;
  rank?: number;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, rank }) => {
  return (
    <Link
      key={author.username}
      href={`/authors/${author.username}`}
      className="group flex items-center gap-4 p-4 bg-card border border-muted rounded-xl hover:shadow-md transition-all"
      aria-label={`Visit profile of ${author.name}`}
    >
      {/* Rank */}
      {rank && (
        <div className="text-xl sm:text-2xl font-bold text-muted-foreground w-8 shrink-0">
          #{rank}
        </div>
      )}

      {/* Avatar */}
      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border">
        <Image
          src={author.avatarUrl}
          alt={author.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Author Info */}
      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:underline line-clamp-1">
          {author.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {author.bio}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Users className="w-4 h-4" />
          {author.followersCount.toLocaleString()} followers
        </div>
      </div>

      {/* Arrow Icon */}
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};

export default AuthorCard;
