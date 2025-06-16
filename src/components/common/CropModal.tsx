'use client';

import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { IImage } from '@/core/types';
import CropCanvas from './CropCanvas';
import Image from 'next/image';
import { uploadImage } from '@/utils/imageUtils';

interface CropModalProps {
  isOpen: boolean;
  closeModal: () => void;
  image: IImage | null;
  aspectRatio?: number;
  handleUpdateMedia: (image: IImage) => Promise<void>;
  setAlerts?: Dispatch<
    SetStateAction<
      {
        message: string;
        variant: string;
      }[]
    >
  >;
}

const CropModal: FC<CropModalProps> = ({
  isOpen,
  closeModal,
  image,
  aspectRatio,
  handleUpdateMedia,
  setAlerts,
}) => {
  const [croppedImages, setCroppedImages] = useState<{ [key: string]: string }>(
    {}
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    dataKey: string;
  }>({
    src: image?.defaultSrc || '',
    dataKey: 'defaultSrc',
  });

  const handleCropEnd = (imagedata: string, pathKey: string) => {
    setCroppedImages((prev) => {
      const newState = { ...prev, [pathKey]: imagedata };
      return newState;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const resultMap: Record<string, string> = {};

    for (const key in croppedImages) {
      const dataUrl = croppedImages[key];
      const base64 = dataUrl.split(',')[1];

      const binaryString = atob(base64);

      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const file = new File([blob], `${image?.alt}_${key}.jpeg`, {
        type: 'image/jpeg',
      });

      const uploadedImage = await uploadImage(file);
      resultMap[key] = uploadedImage.url;
    }
    setLoading(false);
    handleUpdateMedia({ ...image, ...resultMap } as IImage);
    if (setAlerts) {
      setAlerts([
        {
          message: 'Image updated successfully',
          variant: 'success',
        },
      ]);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      isFullscreen={true}
      showCloseButton={true}
    >
      <div className='fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10'>
        <div>
          <h4 className='font-semibold text-center text-gray-800 mb-7 text-title-sm dark:text-white/90'>
            Edit Image
          </h4>
        </div>
        {selectedImage && (
          <CropCanvas
            key={selectedImage.dataKey}
            url={selectedImage.src}
            pathKey={selectedImage.dataKey}
            aspectRatio={aspectRatio}
            onCropEnd={handleCropEnd}
          />
        )}
        <div className='flex flex-wrap gap-4 justify-center items-center mt-6'>
          {[
            {
              src: image?.defaultSrc,
              alt: 'defaultSrc',
              key: 'defaultSrc',
              onclick: () =>
                setSelectedImage({
                  src: image?.defaultSrc || '',
                  dataKey: 'defaultSrc',
                }),
            },
            {
              src: image?.lg,
              alt: 'Large screen image',
              key: 'lg',
              onclick: () =>
                setSelectedImage(() => ({
                  src: image?.lg || '',
                  dataKey: 'lg',
                })),
            },
            {
              src: image?.md,
              alt: 'Medium screen image',
              key: 'md',
              onclick: () =>
                setSelectedImage(() => ({
                  src: image?.md || '',
                  dataKey: 'md',
                })),
            },
            {
              src: image?.sm,
              alt: 'Small screen image',
              key: 'sm',
              onclick: () =>
                setSelectedImage(() => ({
                  src: image?.sm || '',
                  dataKey: 'sm',
                })),
            },
          ].map(
            (img, idx) =>
              img.src && (
                <div key={idx} className='flex flex-col items-center gap-2'>
                  <div
                    className={`relative ${
                      img.key === selectedImage.dataKey
                        ? 'w-[150px] h-[150px]'
                        : 'w-[100px] h-[100px]'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      onClick={img.onclick}
                      className='rounded-lg shadow-sm object-cover'
                    />
                  </div>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    {img.alt}
                  </span>
                </div>
              )
          )}
        </div>

        <div className='flex items-center justify-end w-full gap-3 mt-8'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Close
          </Button>
          <Button size='sm' onClick={handleSave}>
            Save Changes{' '}
            {loading && (
              <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CropModal;
