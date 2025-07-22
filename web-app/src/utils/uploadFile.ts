import { supabase } from "@/lib/supabaseClient";

export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `avatars/${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("my-supabase-bucket")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    throw new Error("Avatar upload failed: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("my-supabase-bucket")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
