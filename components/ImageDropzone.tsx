import React, { useCallback, useState } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageDropzoneProps {
  onImageDrop: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          onImageDrop(file);
        } else {
          alert('画像ファイルのみアップロードできます。');
        }
      }
    },
    [onImageDrop]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageDrop(file);
      } else {
        alert('画像ファイルのみアップロードできます。');
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-indigo-500 bg-gray-800/50' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-800/30'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon />
            <p className="mb-2 text-lg font-semibold text-gray-300">
                <span className="font-bold text-indigo-400">クリックしてアップロード</span> または ドラッグ＆ドロップ
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBPなど</p>
        </div>
        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageDropzone;