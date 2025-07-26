import { supabase } from "@/lib/supabaseClient";

export async function uploadBlogCover(
  file: File,
  blogId: string
): Promise<string> {
  if (!file || !blogId) throw new Error("File or blogId missing");

  const fileExt = file.name.split(".").pop();
  const fileName = `${blogId}.${fileExt}`;
  const filePath = `${fileName}`;

  console.log(filePath, blogId);

  // Upload the file to the blog-covers bucket
  const { error } = await supabase.storage
    .from("blog-covers")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage.from("blog-covers").getPublicUrl(filePath);
  return data.publicUrl;
}
