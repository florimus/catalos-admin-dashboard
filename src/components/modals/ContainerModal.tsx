'use client';

import React from 'react';
import ComponentCard from '../common/ComponentCard';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';

interface ContainerModalProps {
  title?: string;
  isOpen: boolean;
  closeModal: () => void;
  hasCloseButton?: boolean;
  hasSaveButton?: boolean;
  children: React.ReactNode;
  saveButtonText?: string;
  handleSave?: () => void;
}

const ContainerModal: React.FC<ContainerModalProps> = ({
  title,
  isOpen,
  hasCloseButton,
  hasSaveButton,
  saveButtonText,
  closeModal,
  children,
  handleSave,
}) => {
  return (
    <ComponentCard title='Form In Modal'>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className='max-w-[584px] p-5 lg:p-10'
      >
        <div key={Math.random()} className=''>
          <h4 className='mb-6 text-lg font-medium text-gray-800 dark:text-white/90'>
            {title}
          </h4>
          {children}

          <div className='flex items-center justify-end w-full gap-3 mt-6'>
            {hasCloseButton && (
              <Button size='sm' variant='outline' onClick={closeModal}>
                Close
              </Button>
            )}
            {hasSaveButton && (
              <Button size='sm' type='button' onClick={handleSave}>{saveButtonText || 'Save'}</Button>
            )}
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
};

export default ContainerModal;
