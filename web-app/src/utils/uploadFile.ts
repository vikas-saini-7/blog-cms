import { supabase } from "@/lib/supabaseClient";

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  if (!file || !userId) throw new Error("File or userId missing");

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${fileName}`;

  console.log(filePath, userId);

  // Upload the file to the avatars bucket
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}
