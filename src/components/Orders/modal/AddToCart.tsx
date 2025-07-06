'use client';

import { getProducts } from '@/actions/product';
import { getVariantsByProductId } from '@/actions/variant';
import Button from '@/components/ui/button/Button';
import { IPage, IProduct, IResponse, IVariant } from '@/core/types';
import { ChevronLeftIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  setNewProductsSelected: React.Dispatch<
    React.SetStateAction<{ variantId: string; quantity: number }[]>
  >;
}

const AddToCart: React.FC<Props> = ({ setNewProductsSelected }) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const [variants, setVariants] = useState<IVariant[]>([]);

  const [selectedVariants, setSelectedVariants] = useState<IVariant[]>([]);

  const handleSearchProducts = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchQuery = e.target.value;
    const response: IResponse<IPage<IProduct>> = await getProducts(
      searchQuery,
      0,
      20,
      '68374ac320d736a89de249a0'
    );

    if (response.success && response.data?.hits) {
      setProducts(response.data?.hits || []);
    }
  };

  const handleSearchVariants = async (productId: string) => {
    const response: IResponse<IPage<IVariant>> = await getVariantsByProductId(
      productId
    );

    if (response.success && response.data?.hits) {
      setVariants(response.data?.hits || []);
    }
  };

  const handleVariantAction = (variant: IVariant) => {
    setSelectedVariants((prevVariants) => {
      if (prevVariants.some((v) => v.id === variant.id)) {
        return prevVariants.filter((v) => v.id !== variant.id);
      }
      return [...prevVariants, variant];
    });
  };

  useEffect(() => {
    setNewProductsSelected(
      selectedVariants?.map((each) => ({
        variantId: each?.id || '',
        quantity: 1,
      }))
    );
  }, [selectedVariants, setNewProductsSelected]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
      <div className='p-4 col-span-1 md:col-span-4'>
        <h1 className='text-center text-2xl font-bold mb-4 dark:text-white'>
          Search Product
        </h1>

        <div className='flex justify-center mb-6'>
          <input
            type='text'
            placeholder='Search...'
            onChange={handleSearchProducts}
            className='w-full md:w-1/2 p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='col-span-1 md:col-span-1'>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSearchVariants(product.id)}
                className='p-4 border rounded-md shadow-md dark:bg-gray-800 dark:border-gray-600 flex items-center justify-between my-2'
              >
                <h2 className='text-lg font-semibold dark:text-white'>
                  {product.name}
                </h2>
                <ChevronLeftIcon className='rotate-180 dark:text-white' />
              </div>
            ))}
          </div>

          <div className='col-span-1 md:col-span-3'>
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'>
              {variants.map((variant) => (
                <div className='group relative m-2' key={variant.id}>
                  <div className='aspect-square w-full relative'>
                    <Image
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      src={variant?.medias[0]?.defaultSrc}
                      alt={`Image of ${variant.name}`}
                      className='object-cover rounded-md group-hover:opacity-75'
                    />
                  </div>
                  <div className='mt-4 flex justify-between'>
                    <div>
                      <h3 className='text-sm text-gray-700 font-medium'>
                        {variant.name}
                      </h3>
                      <p className='text-xs text-gray-500'>{variant?.skuId}</p>
                    </div>
                    <Button
                      type='button'
                      size='xm'
                      onClick={() => handleVariantAction(variant)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 col-span-1'>
        <h1 className='text-center text-2xl font-bold mb-4 dark:text-white'>
          Cart Items
        </h1>

        <div>
          {selectedVariants.map((variant) => (
            <div
              className='flex items-center justify-between p-2 border rounded-md shadow-md dark:bg-gray-800 dark:border-gray-600 my-2'
              key={variant.id}
            >
              <div className='w-16 h-16 relative'>
                <Image
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  src={variant?.medias[0]?.defaultSrc}
                  alt={`Image of ${variant.name}`}
                  className='object-cover rounded-md'
                />
              </div>
              <div className='flex-1 text-left ms-3'>
                <h3 className='text-sm text-gray-700 font-medium dark:text-white'>
                  {variant.name}
                </h3>
                <p className='text-xs text-gray-500'>{variant?.skuId}</p>
              </div>
              <Button
                type='button'
                size='xm'
                onClick={() => handleVariantAction(variant)}
                className='ml-2'
              >
                <TrashBinIcon className='dark:text-white' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
