'use client';

interface IToolTipProps {
  children: React.ReactNode;
  info: string | React.ReactNode;
}

const ToolTip: React.FC<IToolTipProps> = ({ children, info }) => {
  return (
    <div className='relative inline-block group'>
      {children}

      <div
        id='tt-1'
        role='tooltip'
        className='pointer-events-none absolute z-999 p-2 left-1/2 -translate-x-1/2 translate-y-2 font-light text-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150
               mt-2 w-max max-w-xs rounded-lg bg-white text-gray-900 shadow-lg dark:bg-gray-600 dark:text-white'
      >
        {info}
        <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white dark:bg-gray-700'></div>
      </div>
    </div>
  );
};

export default ToolTip;
