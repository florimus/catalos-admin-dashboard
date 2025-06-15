import { FC } from 'react';

interface EmptySectionProps {
  heading: string;
  description: string;
}

const EmptySection: FC<EmptySectionProps> = ({ heading, description }) => {
  return (
    <div className='border border-gray-200 px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12'>
      <div className='mx-auto w-full max-w-[630px] text-center'>
        <h3 className='mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl'>
          {heading}
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-400 sm:text-base'>
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptySection;
