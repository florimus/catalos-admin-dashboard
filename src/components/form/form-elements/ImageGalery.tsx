'use client';

import FormInModal from '@/components/modals/FormInModal';
import Avatar from '@/components/ui/avatar/Avatar';
import Button from '@/components/ui/button/Button';
import { IImage } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { PencilIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import React, { FC, useState } from 'react';

interface ImageGalleryProps {
  images: IImage[];
  handleEdit?: (index: number, image: IImage) => void;
  handleDelete?: (index: number, image: IImage) => void;
  showOverlay?: boolean;
}

const ImageGallery: FC<ImageGalleryProps> = ({
  images,
  handleEdit,
  handleDelete,
  showOverlay,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedImage, setSelectedImage] = useState<string>('');

  const [deleingImage, setDeleingImage] = useState<IImage | null>(null);

  return (
    <div className='grid grid-cols-3 gap-2 my-4'>
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
                onClick={() => {
                  setDeleingImage({ ...image, index });
                  setSelectedImage(image.defaultSrc);
                  openModal();
                }}
              >
                <TrashBinIcon />
              </Button>
            </div>
          )}
        </div>
      ))}
      {isOpen && (
        <FormInModal
          title='Are you sure you want to delete this image?'
          isOpen={isOpen}
          closeModal={closeModal}
          handleSave={() => {
            if (handleDelete) {
              handleDelete(deleingImage!.index!, deleingImage!);
              closeModal();
            }
          }}
          hasCloseButton={true}
          hasSaveButton={true}
          saveButtonText='Delete'
        >
          <div className='flex flex-col items-center mt-10'>
            <div className='mb-4 relative w-[200px] h-[200px]'>
              <Image
                alt={deleingImage?.alt || ''}
                src={selectedImage || deleingImage?.defaultSrc || ''}
                fill
                className='rounded-full object-cover'
              />
            </div>
            <div className='flex items-center justify-center gap-4 cursor-pointer'>
              <Avatar
                src={deleingImage?.lg || ''}
                onClick={() => setSelectedImage(deleingImage?.lg || '')}
                size='xxlarge'
              />
              <Avatar
                src={deleingImage?.md || ''}
                onClick={() => setSelectedImage(deleingImage?.md || '')}
                size='xxlarge'
              />
              <Avatar
                src={deleingImage?.sm || ''}
                onClick={() => setSelectedImage(deleingImage?.sm || '')}
                size='xxlarge'
              />
            </div>
          </div>
        </FormInModal>
      )}
    </div>
  );
};

export default ImageGallery;
