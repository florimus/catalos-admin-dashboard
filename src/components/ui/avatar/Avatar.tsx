import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src: string; // URL of the avatar image
  alt?: string; // Alt text for the avatar
  size?:
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'huge'; // Avatar size
  status?: 'online' | 'offline' | 'busy' | 'none'; // Status indicator
  onClick?: () => void;
}

const sizeClasses = {
  xsmall: 'h-6 w-6 max-w-6',
  small: 'h-8 w-8 max-w-8',
  medium: 'h-10 w-10 max-w-10',
  large: 'h-12 w-12 max-w-12',
  xlarge: 'h-14 w-14 max-w-14',
  xxlarge: 'h-16 w-16 max-w-16',
  huge: 'h-30 w-30 max-w-20 max-h-20',
};

const statusSizeClasses = {
  xsmall: 'h-1.5 w-1.5 max-w-1.5',
  small: 'h-2 w-2 max-w-2',
  medium: 'h-2.5 w-2.5 max-w-2.5',
  large: 'h-3 w-3 max-w-3',
  xlarge: 'h-3.5 w-3.5 max-w-3.5',
  xxlarge: 'h-4 w-4 max-w-4',
  huge: 'h-4.5 w-4.5 max-w-4.5',
};

const statusColorClasses = {
  online: 'bg-success-500',
  offline: 'bg-error-400',
  busy: 'bg-warning-500',
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  size = 'medium',
  status = 'none',
  onClick = () => {},
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative  rounded-full ${sizeClasses[size]} overflow-hidden object-center border`}
    >
      {/* Avatar Image */}
      <Image
        width='0'
        height='0'
        sizes='100vw'
        src={src}
        alt={alt}
        className='object-center w-full rounded-full overflow-hidden'
      />

      {/* Status Indicator */}
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
            statusSizeClasses[size]
          } ${statusColorClasses[status] || ''}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
