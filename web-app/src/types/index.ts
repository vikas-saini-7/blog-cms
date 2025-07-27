export interface Blog {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  slug: string;
  publishedAt?: Date | null;
  views?: number;
  category?: string;
  likes?: number;
  comments?: number;
  author?: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
}

export interface Author {
  username: string | null;
  name: string;
  avatar: string | null;
  bio?: string | null;
  isProfilePublic: boolean;
  followersCount: number;
  isFollowing: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  username: string;
  isPublic: boolean;
  DOB: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  designation: string;
  contentPreferences: string[];
  createdAt: string;
  updatedAt: string;
  isOnboarded: boolean;
  followersCount: string;
  isFollowing: boolean;
}
