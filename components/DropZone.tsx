import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onImageSelect: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onImageSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="group relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="z-10 flex flex-col items-center space-y-4 text-slate-400 group-hover:text-cyan-400 transition-colors">
        <div className="p-4 rounded-full bg-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-10 h-10" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">Drop your image here</p>
          <p className="text-sm opacity-60 mt-1">or click to browse</p>
        </div>
      </div>

      <div className="absolute bottom-6 flex gap-2 opacity-30">
        {[...Array(5)].map((_, i) => (
          <ImageIcon key={i} className="w-16 h-16 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  );
};

export default DropZone;