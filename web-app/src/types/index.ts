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
  avatar: string;
  bio?: string;
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
