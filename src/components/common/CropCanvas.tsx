'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface CropCanvasProps {
  url: string;
  pathKey: string;
  aspectRatio?: number;
  onCropEnd: (imagedata: string, pathKey: string) => void;
}

const CropCanvas: FC<CropCanvasProps> = ({
  url,
  pathKey,
  onCropEnd,
  aspectRatio = 1,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  const handleCropEnd = () => {
    const cropper = cropperRef.current?.cropper;
    onCropEnd(cropper!.getCroppedCanvas().toDataURL(), pathKey);
  };

  const onReady = () => {
    setIsLoading(false);
  };

  return (
    <div className='relative w-full' style={{ height: 400 }}>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      )}
      <Cropper
        src={url || ''}
        style={{
          height: '100%',
          width: '100%',
          visibility: isLoading ? 'hidden' : 'visible',
        }}
        aspectRatio={aspectRatio}
        guides={true}
        cropend={handleCropEnd}
        // cropBoxResizable={false}
        ready={onReady}
        ref={cropperRef}
      />
    </div>
  );
};

export default CropCanvas;
