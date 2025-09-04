'use client';
import { ChevronDownIcon } from '@/icons';
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='accordion border rounded-md dark:border-gray-700 border-gray-300 my-4'>
      <button
        onClick={toggleAccordion}
        className='accordion-header w-full flex justify-between items-center text-left px-4 py-5 dark:bg-gray-800 bg-gray-200 dark:hover:bg-gray-700 hover:bg-gray-300 dark:text-white text-black font-medium rounded-t-md'
      >
        <span>{title}</span>
        <span className={`chevron ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>
      {isOpen && (
        <div className='accordion-content px-4 py-2 dark:bg-gray-900 bg-gray-100 dark:text-gray-300 text-gray-800 border-t dark:border-gray-700 border-gray-300'>
          {content}
        </div>
      )}
    </div>
  );
};

export default Accordion;
