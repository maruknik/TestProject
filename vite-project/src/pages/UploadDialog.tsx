import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../supabaseClient';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  user: { id: string };
}

export default function UploadDialog({ open, onClose, user }: UploadDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files) return;

    for (const file of Array.from(files)) {
      const filePath = `user-${user.id}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

     if (!uploadError) {
  const { error: insertError } = await supabase
    .from('photos')
    .insert({ user_id: user.id, path: filePath });

  if (insertError) {
    console.error('Insert error:', insertError.message);
  } else {
    console.log('Фото додано в таблицю photos:', filePath);
  }
} else {
  console.error('Upload error:', uploadError.message);
}

    }

    setFiles(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Завантажити фото</DialogTitle>
      <DialogContent>
        <input type="file" multiple onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!files}>Завантажити</Button>
      </DialogContent>
    </Dialog>
  );
}
