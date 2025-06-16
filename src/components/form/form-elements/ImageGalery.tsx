import Button from '@/components/ui/button/Button';
import { IImage } from '@/core/types';
import { PencilIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import React, { FC } from 'react';

interface ImageGalleryProps {
  images: IImage[];
  handleEdit?: (index: number, image: IImage) => void
  handleDelete?: (index: number, image: IImage) => void;
  showOverlay?: boolean;
}

const ImageGallery: FC<ImageGalleryProps> = ({
  images,
  handleEdit,
  handleDelete,
  showOverlay,
}) => {
  return (
    <div className='grid grid-cols-2 gap-2 my-4'>
      {images.map((image, index) => (
        <div
          key={index}
          className='relative w-full aspect-square rounded-lg shadow-md border border-gray-300 dark:border-gray-700 group'
        >
          <Image
            src={image.defaultSrc}
            alt={image.alt || `Image ${index + 1}`}
            fill
            className='rounded-lg object-cover p-1'
          />
          {showOverlay && (
            <div className='absolute inset-0 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30'>
              <Button
                size='xm'
                onClick={() => handleEdit && handleEdit(index, image)}
              >
                <PencilIcon />
              </Button>
              <Button
                size='xm'
                onClick={() => handleDelete && handleDelete(index, image)}
              >
                <TrashBinIcon />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
