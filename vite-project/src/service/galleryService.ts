import { supabase } from '../supabaseClient';
import type { Photo } from '../types/photo';

export const fetchUserPhotos = async (userId: string): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error.message);
    return [];
  }

  return data as Photo[];
};

export const deletePhoto = async (photo: Photo): Promise<boolean> => {
  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([photo.path]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError.message);
    return false;
  }

  const { error: dbError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photo.id);

  if (dbError) {
    console.error('Error deleting photo record:', dbError.message);
    return false;
  }

  return true;
};
