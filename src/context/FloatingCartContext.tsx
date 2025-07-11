'use client';

import Button from '@/components/ui/button/Button';
import { CartIcon, PlusIcon } from '@/icons';
import {
  getLocalStorageItem,
  LOCAL_STORAGE_KEYS,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/localStorageUtils';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalLoader } from './GlobalLoaderContext';
import SecureComponent from '@/core/authentication/SecureComponent';
import { updateCartLineItem } from '@/actions/order';
import { IOrder, IResponse } from '@/core/types';

type FloatingCartContextType = {
  addToCart: (variantId: string) => void;
  createFloatCart: (id: string, variants: string[]) => void;
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
  const { start } = useGlobalLoader();

  const [isVariantPage, setIsVariantPage] = useState<boolean>(false);
  const [isAlreadyExits, setIsAlreadyExits] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const isVariant = path?.includes('/variants/');
    const cartId = getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    const cartItemsString = getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
    if (cartItemsString) {
      try {
        const items: string[] = JSON.parse(cartItemsString) || [];
        if (items && items.length > 0) {
          setIsAlreadyExits(
            Boolean(
              items.find((item) => {
                return path.includes(item);
              })
            )
          );
        }
      } catch (error) {
        console.error('Error parsing cart items from localStorage:', error);
        setIsAlreadyExits(false);
      }
    } else {
      setIsAlreadyExits(false);
    }
    setIsVariantPage(Boolean(cartId && isVariant));
  }, [path]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        setSuccess(false);
        setIsAlreadyExits(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [success]);

  const addToCart = async () => {
    setIsLoading(true);
    const cartId = getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    const variantId = path.split('/').pop() || '';
    const response: IResponse<IOrder> = await updateCartLineItem(
      cartId || '',
      1,
      variantId
    );
    if (response.success && response.data) {
      setIsLoading(false);
      setSuccess(true);
      const cart: IOrder = response.data;
      setLocalStorageItem(
        LOCAL_STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(cart?.lineItems?.map((item) => item?.variant?.id) || [])
      );
    }
  };

  const goToCart = () => {
    const cartId = getLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    removeLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    removeLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
    start(() => router.push(`/carts/${cartId}`));
  };

  const createFloatCart = (id: string, variants: string[]) => {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID, id);
    setLocalStorageItem(
      LOCAL_STORAGE_KEYS.CART_ITEMS,
      JSON.stringify(variants)
    );
  };

  const deleteFloatCart = () => {
    removeLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID);
    removeLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
    setIsVariantPage(false);
  };

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const tickLoader = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-4 w-4 text-green-500'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
    </svg>
  );

  return (
    <FloatingCartContext.Provider
      value={{ addToCart, goToCart, createFloatCart, deleteFloatCart }}
    >
      <div>
        {children}
        <SecureComponent permission='ORD:LS'>
          {isVariantPage && (
            <div className='fixed bottom-5 right-5 z-50 flex'>
              {!isAlreadyExits && (
                <SecureComponent permission='ORD:NN'>
                  <Button onClick={addToCart}>
                    <PlusIcon />
                    Add to Cart {isLoading && statusLoader}
                    {success && tickLoader}
                  </Button>
                </SecureComponent>
              )}
              <div className='relative flex'>
                <Button className='mx-2' onClick={goToCart}>
                  <CartIcon className='' />
                </Button>
                <button
                  className='absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                  onClick={deleteFloatCart}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </SecureComponent>
      </div>
    </FloatingCartContext.Provider>
  );
};
