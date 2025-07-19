export interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;

  category?: "tech" | "design" | "entertainment" | "health" | "politics";
  likes?: number;
  comments?: number;
}

export interface Author {
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  isProfilePublic: boolean;
  followersCount: number;
  isFollowing: boolean;
}
