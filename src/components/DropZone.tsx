import React, { useRef } from 'react';
import { UploadCloud, FileImage } from 'lucide-react';

type DropZoneProps = {
  onSelectFile: (file: File) => void;
  originalStats: { w: number; h: number; kb: number } | null;
};

export default function DropZone({ onSelectFile, originalStats }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    onSelectFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-saffron-500', 'bg-orange-50/50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-saffron-500', 'bg-orange-50/50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-saffron-500', 'bg-orange-50/50');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="mb-3 block font-heading text-lg font-semibold text-navy-900">
        3. Upload Photo/Signature
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition-colors hover:border-saffron-500 hover:bg-orange-50/50"
      >
        <div className="mb-3 rounded-full bg-white p-3 shadow-sm group-hover:bg-saffron-100 group-hover:text-saffron-600">
          <UploadCloud size={24} className="text-slate-400 group-hover:text-saffron-600" />
        </div>
        <p className="text-sm font-medium text-slate-700">Click or drag image here</p>
        <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP allowed</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleChange}
        />
      </div>

      {originalStats && (
        <div className="mt-4 flex items-center gap-3 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
          <FileImage size={16} className="text-navy-500" />
          <span>
            Original: {originalStats.w}x{originalStats.h}px • {originalStats.kb} KB
          </span>
        </div>
      )}
    </div>
  );
}
