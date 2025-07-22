import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';

interface SupabaseError {
  message: string;
  status?: number;
}

export const uploadFiles = async (
  userId: string,
  files: FileList
): Promise<void> => {
  for (const file of Array.from(files)) {
    let fileToUpload = file;

   
    if (file.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 1,          
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options);
      } catch (error) {
        console.warn('Не вдалося стиснути зображення:', error);
        fileToUpload = file;
      }
    }

    const filePath = `user-${userId}/${fileToUpload.name}`;

    const { error: uploadError }: { error: SupabaseError | null } =
      await supabase.storage
        .from('gallery')
        .upload(filePath, fileToUpload);

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    const { error: insertError }: { error: SupabaseError | null } = await supabase
      .from('photos')
      .insert({ user_id: userId, path: filePath });

    if (insertError) {
      throw new Error(`Insert error: ${insertError.message}`);
    }
  }
};
