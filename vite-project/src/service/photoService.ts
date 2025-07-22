import { supabase } from "../supabaseClient";

type Photo = {
  id: string;
  user_id: string;
  path: string;
  created_at: string;
};

export const uploadPhoto = async (file: File, userId: string) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("photos").upload(filePath, file);
  if (error) throw error;
  return filePath;
};

export const getPhotoUrl = (path: string) => {
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
};

export const fetchUserPhotos = async (userId: string) => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", userId)
    .overrideTypes<Photo[]>();

  if (error) throw error;
  return data;
};
