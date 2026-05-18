import React, { useState, useRef, useCallback } from 'react';
import { Camera, Loader2, Check, AlertCircle, X, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import { uploadImageToDrive } from '../services/imageService';
import { getGoogleDriveDirectLink } from '../utils/imageHelper';
import getCroppedImg from '../utils/cropImage';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
  aspect?: number; 
  targetWidth?: number;
  targetHeight?: number;
  category?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  label,
  aspect = 1,
  targetWidth = 800,
  targetHeight = 800,
  category = 'Geral'
}) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setUploading(true);
    setImageToCrop(null); // Close modal
    setStatus('idle');

    try {
      // Get cropped image as base64
      const croppedBase64 = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        targetWidth,
        targetHeight
      );

      const result = await uploadImageToDrive(croppedBase64, 'upload.jpg', category);

      if (result.success && result.url) {
        onChange(result.url);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        console.error('Upload failed:', result.error);
        setStatus('error');
      }
    } catch (err) {
      console.error('Crop/Upload error:', err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex justify-between items-end px-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
          <span className="text-[9px] font-medium text-primary/60 uppercase tracking-tight">Tamanho ideal: {targetWidth}x{targetHeight}px</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-outline-variant/30 shrink-0 bg-surface-container shadow-sm">
            <img 
              src={getGoogleDriveDirectLink(value)} 
              alt="preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=...';
              }}
            />
          </div>
        )}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder || "URL ou ID da Imagem"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 pr-10 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-primary/50 transition-colors"
          />
          {status === 'success' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
              <Check size={18} />
            </div>
          )}
          {status === 'error' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
        
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            uploading 
              ? 'bg-surface-container text-on-surface-variant' 
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white'
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Cropping Modal */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <Scissors size={20} className="text-primary" />
                <h3 className="font-display font-bold">Ajustar Imagem</h3>
              </div>
              <button onClick={() => setImageToCrop(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 relative bg-[#121212]">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { background: '#121212' },
                  cropAreaStyle: { border: '2px solid white' }
                }}
              />
            </div>

            <div className="p-8 bg-black space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={0.5}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setImageToCrop(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-sm text-white border border-white/20 active:scale-95 transition-transform"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  Confirmar e Enviar
                </button>
              </div>
              <p className="text-center text-white/60 text-[10px] uppercase tracking-widest font-bold">
                Formatando para {targetWidth}x{targetHeight} pixels
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
