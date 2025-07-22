import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useState, type ChangeEvent } from 'react';
import { uploadFiles } from '../service/uploadService';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  user: { id: string };
}

export default function UploadDialog({ open, onClose, user }: UploadDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setError('');
  };

  const handleUpload = async () => {
    if (!files) return;
    setLoading(true);
    setError('');
    try {
      await uploadFiles(user.id, files);
      setFiles(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Завантажити фото</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <input type="file" multiple onChange={handleFileChange} />
        {error && <p className="text-red-600">{error}</p>}
        <Button
          onClick={handleUpload}
          disabled={!files || loading}
          variant="contained"
          color="primary"
        >
          {loading ? 'Завантаження...' : 'Завантажити'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
