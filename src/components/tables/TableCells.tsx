import Image from 'next/image';
import { TableCell } from '../ui/table';
import Badge, { BadgeColor } from '../ui/badge/Badge';

const ProfileCell = ({
  hasAvatar = false,
  src = '',
  alt = '',
  primaryText,
  secondaryText,
  onclick,
}: {
  hasAvatar?: boolean;
  src?: string;
  alt?: string;
  primaryText?: string;
  secondaryText?: string;
  onclick?: () => void;
}) => {
  return (
    <TableCell className='px-5 py-4 sm:px-6 text-start'>
      <div
        className={`flex items-center gap-3${onclick ? ' cursor-pointer' : ''}`}
        onClick={onclick}
      >
        {hasAvatar && (
          <div className="w-10 h-10 relative overflow-hidden rounded">
          <Image
            src={src}
            alt={alt || "default"}
            fill
            className="object-cover"
          />
        </div>
        )}
        <div>
          <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
            {primaryText}
          </span>
          <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
            {secondaryText}
          </span>
        </div>
      </div>
    </TableCell>
  );
};

const TextCell = ({
  text,
  onclick,
}: {
  text?: string | number;
  onclick?: () => void;
}) => {
  return (
    <TableCell
      className={`px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400`}
    >
      <span onClick={onclick} className={onclick ? 'cursor-pointer' : ''} >{text}</span>
    </TableCell>
  );
};

const TeamCell = ({ images = [] }: { images: string[] }) => {
  return (
    <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
      <div className='flex -space-x-2'>
        {images.map((teamImage, index) => (
          <div
            key={index}
            className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'
          >
            <Image
              width={24}
              height={24}
              src={teamImage}
              alt={`Team member ${index + 1}`}
              className='w-full'
            />
          </div>
        ))}
      </div>
    </TableCell>
  );
};

const StatusCell = ({
  status = '',
  color = 'primary',
}: {
  status?: string;
  color?: BadgeColor;
}) => {
  return (
    <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
      <Badge size='sm' color={color}>
        {status}
      </Badge>
    </TableCell>
  );
};

export enum TableCellTypes {
  ProfileCell,
  TextCell,
  TeamCell,
  StatusCell,
}

export const TableCells = {
  ProfileCell,
  TextCell,
  TeamCell,
  StatusCell,
};
