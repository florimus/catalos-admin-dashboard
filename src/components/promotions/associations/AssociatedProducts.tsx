'use client';

import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/form/input/Checkbox';
import Avatar from '@/components/ui/avatar/Avatar';
import SecureComponent from '@/core/authentication/SecureComponent';
import { IBrand, ICategory, IPromotionSearchProduct } from '@/core/types';
import { Dispatch, FC, SetStateAction } from 'react';

interface AssociatedProductsProps {
  promotionId: string;
  promotionProducts: IPromotionSearchProduct[];
  productPromotionModal: () => void;
  setPromotionCriteria: Dispatch<
    SetStateAction<{
      promotionBrands: IBrand[];
      promotionCategories: ICategory[];
      promotionProducts: IPromotionSearchProduct[];
    }>
  >;
}
const AssociatedProducts: FC<AssociatedProductsProps> = ({
  promotionProducts,
  setPromotionCriteria,
  productPromotionModal,
}) => {
  const handleVariantSelectionClick = (
    variantId: string,
    product: IPromotionSearchProduct,
    isSelecting: boolean
  ) => {
    setPromotionCriteria((prev) => {
      return {
        ...prev,
        promotionProducts: prev?.promotionProducts?.map((prevProduct) => {
          if (prevProduct?.productId === product?.productId) {
            return {
              ...prevProduct,
              variants: prevProduct?.variants?.map((variant) => {
                if (variant?.id === variantId) {
                  return {
                    ...variant,
                    status: isSelecting ? 'Selected' : 'UnSelected',
                  };
                }
                return variant;
              }),
            };
          }
          return prevProduct;
        }),
      };
    });
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <p className='text-gray-800 dark:text-gray-200 m-3 my-5'>
          Associated Products with Variants
        </p>
        <SecureComponent permission='PRD:NN'>
          <span className='cursor-pointer mx-4' onClick={productPromotionModal}>
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
      {Array.isArray(promotionProducts) && promotionProducts.length
        ? promotionProducts.map(
            (product: IPromotionSearchProduct, index: number) => (
              <Accordion
                key={`promotion_product_id_${product.productId}_index_${index}`}
                title={product?.productName}
                isDefaultOpen={index === 0}
                content={product?.variants?.map((variant, variant_index) => (
                  <span
                    key={`${product.productId}_${variant_index}_${variant?.id}`}
                    className='items-start gap-2 gap-y-5 flex flex-col my-10 mx-12'
                  >
                    <Checkbox
                      checked={variant?.status === 'Selected'}
                      onChange={() => {
                        handleVariantSelectionClick(
                          variant?.id,
                          product,
                          variant?.status === 'UnSelected'
                        );
                      }}
                      label={
                        <div className='flex items-center gap-2 mx-3'>
                          <Avatar size='xlarge' src={variant?.thumbnail} />
                          <div>
                            <p className='font-semibold'>{variant?.name}</p>
                            <p className='opacity-60'>SKU : {variant?.sku}</p>
                            <p className='opacity-30 flex'>ID: {variant?.id}</p>
                          </div>
                        </div>
                      }
                    />
                  </span>
                ))}
              />
            )
          )
        : 'NonProducts'}
    </div>
  );
};

export default AssociatedProducts;
