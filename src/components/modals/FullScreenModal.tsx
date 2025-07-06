'use client';

import ComponentCard from '../common/ComponentCard';

import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';

interface FullScreenModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  closeBUttonText?: string;
  saveBUttonText?: string;
  onSave?: () => void;
  onClose: () => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  isOpen,
  children,
  closeBUttonText,
  saveBUttonText,
  onClose,
  onSave,
}) => {
  return (
    <ComponentCard title='Full Screen Modal'>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isFullscreen={true}
        showCloseButton={true}
      >
        <div className='fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10'>
          {children}
          <div className='flex items-center justify-end w-full gap-3 mt-8'>
            {closeBUttonText && (
              <Button size='sm' variant='outline' onClick={onClose}>
                {closeBUttonText}
              </Button>
            )}
            {saveBUttonText && (
              <Button size='sm' onClick={() => onSave?.()}>
                {saveBUttonText}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
};

export default FullScreenModal;
