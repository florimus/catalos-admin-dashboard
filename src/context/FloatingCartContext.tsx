'use client';

import Button from '@/components/ui/button/Button';
import { CartIcon, PlusIcon } from '@/icons';
import {
  getLocalStorageItem,
  LOCAL_STORAGE_KEYS,
  removeLocalStorageItem,
} from '@/utils/localStorageUtils';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalLoader } from './GlobalLoaderContext';

type FloatingCartContextType = {
  addToCart: (variantId: string) => void;
  createFloatCart: (id: string) => void;
  goToCart: () => void;
  deleteFloatCart: () => void;
};

export const FloatingCartContext = createContext<FloatingCartContextType>({
  addToCart: () => {},
  createFloatCart: () => {},
  goToCart: () => {},
  deleteFloatCart: () => {},
});

export const useFloatingCart = () => {
  const context = useContext(FloatingCartContext);
  if (!context) {
    throw new Error(
      'FloatingCart must be used within a FloatingCartContextProvider'
    );
  }
  return context;
};

export const FloatingCartContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const path = usePathname();
  const router = useRouter();
  const {start} = useGlobalLoader();

  const [isVariantPage, setIsVariantPage] = useState<boolean>(false);

  useEffect(() => {
    const isVariant = path?.includes('/variants/');
    const cartId = getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    setIsVariantPage(Boolean(cartId && isVariant));
  }, [path]);

  const addToCart = (variantId: string) => {
    // Logic to add item to cart
    console.log(`Adding variant ${variantId} to cart`);
  };

  const goToCart = () => {
    start(() => router.push(`/carts/${getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID)}`));
  };

  const createFloatCart = (id: string) => {
    // Logic to float cart with the given id
    console.log(`Floating cart with id ${id}`);
  };

  const deleteFloatCart = () => {
    removeLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    setIsVariantPage(false);
  };

  return (
    <FloatingCartContext.Provider
      value={{ addToCart, goToCart, createFloatCart, deleteFloatCart }}
    >
      <div>
        {children}
        {isVariantPage && (
          <div className='fixed bottom-5 right-5 z-50 flex'>
            <Button className=''>
              <PlusIcon />
              Add to Cart
            </Button>
            <div className='relative flex'>
              <Button className='mx-2' onClick={goToCart}>
                <CartIcon className='' />
              </Button>
              <button
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                onClick={deleteFloatCart}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </FloatingCartContext.Provider>
  );
};
