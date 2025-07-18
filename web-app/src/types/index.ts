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
