'use client';

import Button from '@/components/ui/button/Button';
import SecureComponent from '@/core/authentication/SecureComponent';
import { IBrand, ICategory, IPromotionSearchProduct } from '@/core/types';
import { TrashBinIcon } from '@/icons';
import { Dispatch, FC, SetStateAction } from 'react';

interface AssociatedProductsProps {
  promotionId: string;
  promotionCategories: ICategory[];
  openCategoryModal: () => void;
  setPromotionCriteria: Dispatch<
    SetStateAction<{
      promotionBrands: IBrand[];
      promotionCategories: ICategory[];
      promotionProducts: IPromotionSearchProduct[];
    }>
  >;
}
const AssociatedCategories: FC<AssociatedProductsProps> = ({
  promotionCategories,
  setPromotionCriteria,
  openCategoryModal,
}) => {
  const handleVariantSelectionClick = (
    promotionCategory: ICategory,
    isSelecting: boolean
  ) => {
    setPromotionCriteria((prev) => {
      return {
        ...prev,
        promotionCategories: isSelecting
          ? [...prev?.promotionCategories, promotionCategory]
          : prev?.promotionCategories?.filter(
              (category) => category?.id !== promotionCategory?.id
            ),
      };
    });
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <p className='text-gray-800 dark:text-gray-200 m-3 my-5'>
          Associated Categories
        </p>
        <SecureComponent permission='PRD:NN'>
          <span className='cursor-pointer mx-4' onClick={openCategoryModal}>
            <svg
              className='fill-gray-500 dark:fill-gray-400'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z'
                fill=''
              />
            </svg>
          </span>
        </SecureComponent>
      </div>
      {Array.isArray(promotionCategories) && promotionCategories.length > 0
        ? promotionCategories.map((category: ICategory, index: number) => (
            <span
              key={`${category.id}_${index}_category_list_key`}
              className='gap-2 gap-y-5 flex flex-col my-10'
            >
              <div className='flex justify-between items-center w-full gap-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded'>
                <div>
                  <p className='font-semibold'>{category?.name}</p>
                  <p className='opacity-60'>ID : {category?.id}</p>
                </div>
                <Button
                  size='sm'
                  onClick={() => handleVariantSelectionClick(category, false)}
                  className='cursor-pointer'
                >
                  Remove
                  <TrashBinIcon />
                </Button>
              </div>
            </span>
          ))
        : ''}
    </div>
  );
};

export default AssociatedCategories;
