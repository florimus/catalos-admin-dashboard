'use client';

import { IAddress, IOrder, IOrderLineItem, IResponse } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getChannelId } from '@/utils/mapperUtils';

import Alert from '../ui/alert/Alert';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import Badge from '../ui/badge/Badge';
import { TrashBinIcon } from '@/icons';
import Button from '../ui/button/Button';
import {
  removeCartLineItem,
  updateCartLineItem,
  updateCartLineItems,
  updateOrderAddress,
} from '@/actions/order';
import PriceSummary from './modal/PriceSummary';
import { formatPrice } from '@/utils/stringUtils';
import FullScreenModal from '../modals/FullScreenModal';
import { useModal } from '@/hooks/useModal';
import AddToCart from './modal/AddToCart';
import AddressDisplayCard from './modal/AddressDisplayCard';
import SecureComponent from '@/core/authentication/SecureComponent';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import {
  LOCAL_STORAGE_KEYS,
  setLocalStorageItem,
} from '@/utils/localStorageUtils';

interface CartFormProps {
  cart?: IOrder;
  addresses: IAddress[];
  permission?: string;
}

const CartForm: FC<CartFormProps> = ({ cart, addresses, permission }) => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const [quantityButtonLoaderIndex, setQuantityButtonLoaderIndex] = useState<
    number | null
  >();

  const {
    isOpen: isAddToCartModalOpen,
    openModal: openAddToCartModal,
    closeModal: closeAddToCartModal,
  } = useModal();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const [editShippingAddress, setEditShippingAddress] = useState<boolean>(
    !!!(addresses?.length > 0 || cart?.shippingAddress)
  );
  const [editBillingAddress, setEditBillingAddress] = useState<boolean>(
    !!!(addresses?.length > 0 || cart?.billingAddress)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [cartFormData, setCartFormData] = useState<IOrder>({
    id: cart?.id || '',
    status: cart?.status || '',
    userId: cart?.userId || '',
    email: cart?.email || null,
    channelId: cart?.channelId || '',
    lineItems: cart?.lineItems || [],
    coupon: cart?.coupon || null,
    shippingAddress: cart?.shippingAddress || null,
    billingAddress: cart?.billingAddress || null,
    price: cart?.price || {
      subtotalPrice: 0,
      totalTaxPrice: 0,
      shippingPrice: 0,
      totalDiscountPrice: 0,
      grandTotalPrice: 0,
    },
    guestOrder: cart?.guestOrder || false,
    active: cart?.active || false,
    createdAt: cart?.createdAt || '',
    updatedAt: cart?.updatedAt || '',
  });

  const [billingAddress, setBillingAddress] = useState<IAddress | null>(
    cart?.billingAddress || null
  );
  const [shippingAddress, setShippingAddress] = useState<IAddress | null>(
    cart?.shippingAddress || null
  );

  const [newProductsSelected, setNewProductsSelected] = useState<
    { variantId: string; quantity: number }[]
  >([]);

  const handleAddNewProductsToCart = async () => {
    const response = await updateCartLineItems(
      cart?.id || '',
      newProductsSelected
    );

    if (response.success) {
      closeAddToCartModal();
    }
  };

  const currentChannel = useMemo(() => {
    return getChannelId(cart?.channelId || '');
  }, [cart?.channelId]);

  const handleUpdateQuantity = async (
    quantity: number,
    variantId: string,
    index: number
  ) => {
    if (quantity <= 0) {
      return;
    }
    setQuantityButtonLoaderIndex(index);
    const response: IResponse<IOrder> = await updateCartLineItem(
      cart?.id || '',
      quantity,
      variantId
    );
    setQuantityButtonLoaderIndex(null);
    if (response.success && response.data) {
      setAlerts([
        {
          message: response.message || 'Cart updated successfully',
          variant: 'success',
        },
      ]);
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to update cart',
          variant: 'error',
        },
      ]);
    }
  };

  const handleRemoveLineItem = async (lineItemId: string) => {
    const response: IResponse<IOrder> = await removeCartLineItem(
      cart?.id || '',
      [lineItemId]
    );
    if (response.success && response.data) {
      setAlerts([
        {
          message: response.message || 'Item removed from cart successfully',
          variant: 'success',
        },
      ]);
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to remove item from cart',
          variant: 'error',
        },
      ]);
    }
  };

  const customerDetailsFields = [
    {
      fieldType: FormFieldType.Text,
      name: 'customer-email',
      label: 'Email',
      onChange: () => {},
      value: cartFormData.email || cartFormData?.userId,
      placeholder: 'Enter email',
      id: 'customer_email',
      required: true,
      disabled: true,
      error: false,
    },
  ];

  const shippingAddressFields = [
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-addressLine1',
      label: 'Address Line 1',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          addressLine1: event.target.value || '',
        }));
      },
      value: shippingAddress?.addressLine1 || '',
      placeholder: 'Address Line 1',
      id: 'shipping_addressLine1',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-addressLine2',
      label: 'Address Line 2',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          addressLine2: event.target.value || '',
        }));
      },
      value: shippingAddress?.addressLine2 || '',
      placeholder: 'Address Line 2',
      id: 'shipping_addressLine2',
      required: false,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-phone',
      label: 'Phone',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          phone: event.target.value || '',
        }));
      },
      value: billingAddress?.phone || '',
      placeholder: 'Phone number',
      id: 'billing_phone',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-country',
      label: 'Country',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          country: event.target.value || '',
        }));
      },
      value: shippingAddress?.country || '',
      placeholder: 'Country',
      id: 'shipping_country',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-state',
      label: 'State',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          state: event.target.value || '',
        }));
      },
      value: shippingAddress?.state || '',
      placeholder: 'State',
      id: 'shipping_state',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-city',
      label: 'City',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          city: event.target.value || '',
        }));
      },
      value: shippingAddress?.city || '',
      placeholder: 'City',
      id: 'shipping_city',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-area',
      label: 'Area',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          area: event.target.value || '',
        }));
      },
      value: shippingAddress?.area || '',
      placeholder: 'Area',
      id: 'shipping_area',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'shipping-pinCode',
      label: 'Pin code',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          pinCode: event.target.value || '',
        }));
      },
      value: shippingAddress?.pinCode || '',
      placeholder: 'Pin code',
      id: 'shipping_pinCode',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Switch,
      label: 'Billing address same as shipping address',
      name: 'shipping-billing-same',
      disabled: false,
      checked: false,
      onChange: () => {},
    },
  ];

  const billingAddressFields = [
    {
      fieldType: FormFieldType.Text,
      name: 'billing-addressLine1',
      label: 'Address Line 1',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          addressLine1: event.target.value || '',
        }));
      },
      value: billingAddress?.addressLine1 || '',
      placeholder: 'Address Line 1',
      id: 'billing_addressLine1',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-addressLine2',
      label: 'Address Line 2',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          addressLine2: event.target.value || '',
        }));
      },
      value: billingAddress?.addressLine2 || '',
      placeholder: 'Address Line 2',
      id: 'billing_addressLine2',
      required: false,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-phone',
      label: 'Phone',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          phone: event.target.value || '',
        }));
      },
      value: billingAddress?.phone || '',
      placeholder: 'Phone number',
      id: 'billing_phone',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-country',
      label: 'Country',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          country: event.target.value || '',
        }));
      },
      value: billingAddress?.country || '',
      placeholder: 'Country',
      id: 'billing_country',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-state',
      label: 'State',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          state: event.target.value || '',
        }));
      },
      value: billingAddress?.state || '',
      placeholder: 'State',
      id: 'billing_state',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-city',
      label: 'City',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          city: event.target.value || '',
        }));
      },
      value: billingAddress?.city || '',
      placeholder: 'City',
      id: 'billing_city',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-area',
      label: 'Area',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          area: event.target.value || '',
        }));
      },
      value: billingAddress?.area || '',
      placeholder: 'Area',
      id: 'billing_area',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Text,
      name: 'billing-pinCode',
      label: 'Pin code',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress((prev) => ({
          ...(prev || ({} as IAddress)),
          pinCode: event.target.value || '',
        }));
      },
      value: billingAddress?.pinCode || '',
      placeholder: 'Pin code',
      id: 'billing_pinCode',
      required: true,
      disabled: false,
      error: false,
    },
    {
      fieldType: FormFieldType.Switch,
      label: 'Shipping address same as billing address',
      name: 'billing-shipping-same',
      disabled: false,
      checked: false,
      onChange: () => {},
    },
  ];

  const headingData: string[] = ['Products', 'Quantity', 'Price'];

  const products = (lineItem: IOrderLineItem) => {
    return lineItem?.product;
  };

  const variant = (lineItem: IOrderLineItem) => {
    return lineItem?.variant;
  };

  const quantityButtonLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const handleGotoProduct = (variantId: string) => {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.CART_ID, cart?.id || '');
    start(() => router.push(`/variants/${variantId}`));
  };

  const tableData =
    cart?.lineItems?.map((item, index) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: true,
        src: variant(item).medias?.[0]?.defaultSrc,
        alt: variant(item).name,
        primaryText: (
          <span>
            {products(item).name}
            <span className='opacity-50 me-4'> {variant(item).name}</span>
            {item.itemPrice.discountName ? (
              <span>
                <Badge variant='light' color='success' size='sm'>
                  {item.itemPrice.discountFlatPrice} OFF
                </Badge>
                <Badge variant='light' size='sm'>
                  {item.itemPrice.discountName}
                </Badge>
              </span>
            ) : (
              ''
            )}
          </span>
        ),
        secondaryText: variant(item)?.skuId,
        onclick: () => handleGotoProduct(variant(item)?.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: (
          <div className='flex items-center space-x-2'>
            {
              <SecureComponent permission={permission}>
                <button
                  className='h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  disabled={item.quantity === 1}
                  onClick={() =>
                    handleUpdateQuantity(
                      item.quantity - 1,
                      item.variant.id,
                      index
                    )
                  }
                >
                  -
                </button>
              </SecureComponent>
            }
            <span>
              {quantityButtonLoaderIndex === index
                ? quantityButtonLoader
                : item.quantity}
            </span>
            <SecureComponent permission={permission}>
              <button
                className='h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                onClick={() =>
                  handleUpdateQuantity(
                    item.quantity + 1,
                    item.variant.id,
                    index
                  )
                }
              >
                +
              </button>
            </SecureComponent>
          </div>
        ),
      },
      {
        type: TableCellTypes.TextCell,
        text:
          item.itemPrice.salesPrice === item.itemPrice.finalPrice ? (
            <span className='font-semibold'>
              {getChannelId(cart.channelId)?.currency}{' '}
              {formatPrice(item.itemPrice.finalPrice, 'en-IN')}
            </span>
          ) : (
            <span>
              <span className='font-semibold me-2'>
                {getChannelId(cart.channelId)?.currency}{' '}
                {formatPrice(item.itemPrice.finalPrice, 'en-IN')}
              </span>
              <span className='opacity-50 line-through'>
                {getChannelId(cart.channelId)?.currency}{' '}
                {formatPrice(item.itemPrice.salesPrice, 'en-IN')}
              </span>
            </span>
          ),
      },
      {
        type: TableCellTypes.TextCell,
        text: (
          <SecureComponent permission={permission}>
            <span className='flex'>
              <span
                className='me-5 cursor-pointer'
                onClick={() => handleRemoveLineItem(item.id)}
              >
                <TrashBinIcon />
              </span>
            </span>
          </SecureComponent>
        ),
      },
    ]) || [];

  const formatCartPrice = useCallback(() => {
    if (!cart?.price) {
      return [];
    }
    return [
      {
        label: 'Subtotal',
        value: formatPrice(cart?.price.subtotalPrice, 'en-IN'),
      },
      {
        label: 'Tax',
        value: formatPrice(cart?.price.totalTaxPrice, 'en-IN'),
      },
      {
        label: 'Shipping',
        value: formatPrice(cart?.price.shippingPrice, 'en-IN'),
      },
      {
        label: 'Discount',
        value: formatPrice(cart?.price.totalDiscountPrice, 'en-IN'),
      },
      {
        label: 'Grand Total',
        value: formatPrice(cart?.price.grandTotalPrice, 'en-IN'),
        isBold: true,
      },
    ];
  }, [cart?.price]);

  const handleEditBillingAddress = async (address: IAddress | null) => {
    if (address) {
      const response = await updateOrderAddress(cart?.id || '', {
        ...address,
        addressType: 'Billing',
      });
      if (response.success && response.data) {
        setEditBillingAddress(false);
        setAlerts([
          {
            message: 'Billing address Updated successfully',
            variant: 'success',
          },
        ]);
        setCartFormData(response.data);
      } else {
        setAlerts([
          {
            message: response.message || 'Failed to update billing address',
            variant: 'error',
          },
        ]);
      }
    }
  };

  const handleEditShippingAddress = async (address: IAddress | null) => {
    if (address) {
      const response = await updateOrderAddress(cart?.id || '', {
        ...address,
        addressType: 'Shipping',
      });
      if (response.success && response.data) {
        setEditShippingAddress(false);
        setAlerts([
          {
            message: 'Shipping address Updated successfully',
            variant: 'success',
          },
        ]);
        setCartFormData(response.data);
      } else {
        setAlerts([
          {
            message: response.message || 'Failed to update shipping address',
            variant: 'error',
          },
        ]);
      }
    }
  };

  return (
    <>
      {Array.isArray(alerts) &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Alert
            key={alert.message}
            message=''
            variant={alert.variant as 'success' | 'error' | 'warning' | 'info'}
            title={alert.message}
          />
        ))}
      <div className='flex justify-between items-center my-5'>
        <h1 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
          Total {cart?.lineItems?.length || 0} Item(s)
        </h1>
        <SecureComponent permission={permission}>
          <Button
            onClick={openAddToCartModal}
            className='bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
          >
            Add Product
          </Button>
        </SecureComponent>
      </div>
      <BasicTableOne
        headingData={headingData}
        tableData={tableData}
        isEmpty={cart?.lineItems?.length === 0}
      />
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 my-6'>
        <div className='grid col-span-1'>
          <div>
            <PriceSummary
              itemList={formatCartPrice()}
              currency={currentChannel?.currency || ''}
            />
          </div>
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Customer Details'
              fields={customerDetailsFields}
            />
            <AddressDisplayCard
              title='Shipping Address'
              address={cart?.shippingAddress}
              addresses={addresses}
              isEditing={editShippingAddress}
              updateAddress={handleEditShippingAddress}
              setIsEditing={setEditShippingAddress}
            >
              <DefaultInputs
                heading='Shipping Address'
                fields={shippingAddressFields}
                cta={{
                  permission,
                  label: 'Save',
                  onSubmit: () => handleEditShippingAddress(shippingAddress),
                }}
              />
            </AddressDisplayCard>
            <AddressDisplayCard
              title='Billing Address'
              address={cart?.billingAddress}
              addresses={addresses}
              isEditing={editBillingAddress}
              updateAddress={handleEditBillingAddress}
              setIsEditing={setEditBillingAddress}
            >
              <DefaultInputs
                heading='Billing Address'
                cta={{
                  permission,
                  label: 'Save',
                  onSubmit: () => handleEditBillingAddress(billingAddress),
                }}
                fields={billingAddressFields}
              />
            </AddressDisplayCard>
          </div>
        </div>
        <div className='grid col-span-1'>
          <div></div>
        </div>
      </div>
      {isAddToCartModalOpen && (
        <FullScreenModal
          isOpen={isAddToCartModalOpen}
          onClose={closeAddToCartModal}
          closeBUttonText='Cancel'
          saveBUttonText='Add To Cart'
          onSave={handleAddNewProductsToCart}
        >
          <AddToCart setNewProductsSelected={setNewProductsSelected} />
        </FullScreenModal>
      )}
    </>
  );
};

export default CartForm;
