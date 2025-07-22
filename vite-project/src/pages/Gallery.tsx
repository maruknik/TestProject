import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import UploadDialog from './UploadDialog.tsx';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Photo {
  id: string;
  path: string;
  user_id: string;
  created_at: string;
}

interface GalleryProps {
  user: { id: string };
}

export default function Gallery({ user }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error.message);
    } else {
      setPhotos(data as Photo[]);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (photo: Photo) => {
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([photo.path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id);

    if (dbError) {
      console.error('Error deleting photo record:', dbError.message);
      return;
    }

    fetchPhotos();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Моя галерея</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Додати фото
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Фотографій ще немає 🙁</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md group"
            >
              <img
                src={`https://itaajdhocsogknjbpcvy.supabase.co/storage/v1/object/public/gallery/${photo.path}`}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-white/70 rounded-full backdrop-blur-sm">
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(photo)}
                  size="small"
                  className="text-red-600 hover:text-red-800"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDialog
        open={open}
        onClose={() => {
          setOpen(false);
          fetchPhotos();
        }}
        user={user}
      />
    </div>
  );
}
