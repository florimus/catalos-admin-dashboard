'use client';

import { IAddress, IOrder, IOrderLineItem } from '@/core/types';
import {
  FormFields,
  FormFieldType,
  ITextFormFieldProps,
} from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getChannelId,
  paymentOptionToSingleSelectMapper,
} from '@/utils/mapperUtils';

import Alert from '../ui/alert/Alert';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import Badge from '../ui/badge/Badge';
import { BoltIcon } from '@/icons';
import Button from '../ui/button/Button';
import PriceSummary from './modal/PriceSummary';
import { formatPrice } from '@/utils/stringUtils';
import AddressDisplayCard from './modal/AddressDisplayCard';
import SecureComponent from '@/core/authentication/SecureComponent';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { useFloatingCart } from '@/context/FloatingCartContext';

interface OrderFormProps {
  order?: IOrder;
  addresses: IAddress[];
  permission?: string;
}

const OrderForm: FC<OrderFormProps> = ({ order, addresses, permission }) => {
  const router = useRouter();
  const { start } = useGlobalLoader();
  const { createFloatCart } = useFloatingCart();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [cartFormData] = useState<IOrder>({
    id: order?.id || '',
    status: order?.status || '',
    userId: order?.userId || '',
    email: order?.email || null,
    channelId: order?.channelId || '',
    lineItems: order?.lineItems || [],
    coupon: order?.coupon || null,
    shippingAddress: order?.shippingAddress || null,
    billingAddress: order?.billingAddress || null,
    price: order?.price || {
      subtotalPrice: 0,
      totalTaxPrice: 0,
      shippingPrice: 0,
      totalDiscountPrice: 0,
      grandTotalPrice: 0,
    },
    guestOrder: order?.guestOrder || false,
    active: order?.active || false,
    createdAt: order?.createdAt || '',
    updatedAt: order?.updatedAt || '',
  });

  const currentChannel = useMemo(() => {
    return getChannelId(order?.channelId || '');
  }, [order?.channelId]);

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

  const paymentOptions = [
    {
      fieldType: FormFieldType.DropDown,
      name: 'payment-method',
      label: `Payment options`,
      onChange: () => {},
      options: paymentOptionToSingleSelectMapper(order?.paymentOptions || []),
      defaultValue: order?.paymentInfo?.mode?.id || '',
      placeholder: 'Select Payment Method',
      disabled: order?.status != 'InProgress',
      id: 'payment_method-id',
      required: true,
    },
  ];

  const paymentOptionCta = useMemo(() => {
    return {
      permission: 'NO:EDITS',
      label: order?.paymentInfo?.mode?.external
        ? 'Generate Link'
        : 'Confirm Order',
      onSubmit: () => {},
      loading: false,
    };
  }, [order?.paymentInfo?.mode?.external]);

  const headingData: string[] = [
    'Products',
    'Quantity',
    'Price',
    'Unit Id',
    'Package Id',
  ];

  const products = (lineItem: IOrderLineItem) => {
    return lineItem?.product;
  };

  const variant = (lineItem: IOrderLineItem) => {
    return lineItem?.variant;
  };

  const handleGotoProduct = (variantId: string) => {
    createFloatCart(
      order?.id || '',
      order?.lineItems?.map((item) => variant(item)?.id) || []
    );
    start(() => router.push(`/variants/${variantId}`));
  };

  const handleMinimizeCart = () => {
    createFloatCart(
      order?.id || '',
      order?.lineItems?.map((item) => variant(item)?.id) || []
    );
    start(() => router.push('/orders'));
  };

  const tableData =
    order?.lineItems?.map((item) => [
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
            <span>{item.quantity}</span>
          </div>
        ),
      },
      {
        type: TableCellTypes.TextCell,
        text:
          item.itemPrice.salesPrice === item.itemPrice.finalPrice ? (
            <span className='font-semibold'>
              {getChannelId(order.channelId)?.currency}{' '}
              {formatPrice(item.itemPrice.finalPrice, 'en-IN')}
            </span>
          ) : (
            <span>
              <span className='font-semibold me-2'>
                {getChannelId(order.channelId)?.currency}{' '}
                {formatPrice(item.itemPrice.finalPrice, 'en-IN')}
              </span>
              <span className='opacity-50 line-through'>
                {getChannelId(order.channelId)?.currency}{' '}
                {formatPrice(item.itemPrice.salesPrice, 'en-IN')}
              </span>
            </span>
          ),
      },
      {
        type: TableCellTypes.TextCell,
        text: (
          <SecureComponent permission={permission}>
            {[...Array(item.quantity).keys()].map((index) => (
              <FormFields.TextFormField
                key={index}
                {...({
                  fieldType: FormFieldType.Text,
                  name: `product-unit-id-${index}-${variant(item)?.id}`,
                  onChange: () => {},
                  value: '',
                  placeholder: 'Enter product unit id',
                  id: `product-unit-id-${index}-${variant(item)?.id}`,
                  required: true,
                  error: false,
                } as unknown as ITextFormFieldProps)}
              />
            ))}
          </SecureComponent>
        ),
      },
      {
        type: TableCellTypes.TextCell,
        text: (
          <SecureComponent permission={permission}>
            {[...Array(item.quantity).keys()].map((index) => (
              <FormFields.TextFormField
                key={index}
                {...({
                  fieldType: FormFieldType.Text,
                  name: `package-unit-id-${index}-${variant(item)?.id}`,
                  onChange: () => {},
                  value: '',
                  placeholder: 'Enter package id',
                  id: `package-unit-id-${index}-${variant(item)?.id}`,
                  required: true,
                  error: false,
                } as unknown as ITextFormFieldProps)}
              />
            ))}
          </SecureComponent>
        ),
      },
    ]) || [];

  const formatCartPrice = useCallback(() => {
    if (!order?.price) {
      return [];
    }
    return [
      {
        label: 'Subtotal',
        value: formatPrice(order?.price.subtotalPrice, 'en-IN'),
      },
      {
        label: 'Tax',
        value: formatPrice(order?.price.totalTaxPrice, 'en-IN'),
      },
      {
        label: 'Shipping',
        value: formatPrice(order?.price.shippingPrice, 'en-IN'),
      },
      {
        label: 'Discount',
        value: formatPrice(order?.price.totalDiscountPrice, 'en-IN'),
      },
      {
        label: 'Grand Total',
        value: formatPrice(order?.price.grandTotalPrice, 'en-IN'),
        isBold: true,
      },
    ];
  }, [order?.price]);

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
          Total {order?.lineItems?.length || 0} Item(s)
        </h1>
        <div className='flex'>
          <Button
            type='button'
            size='xm'
            className='me-2'
            onClick={handleMinimizeCart}
          >
            <BoltIcon />
          </Button>
        </div>
      </div>
      <BasicTableOne
        headingData={headingData}
        tableData={tableData}
        isEmpty={order?.lineItems?.length === 0}
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
              permission={'NO:EDITS'}
              address={order?.shippingAddress}
              addresses={addresses}
              isEditing={false}
              updateAddress={async () => {}}
              setIsEditing={() => {}}
            />
            <AddressDisplayCard
              title='Billing Address'
              permission={'NO:EDITS'}
              address={order?.billingAddress}
              addresses={addresses}
              isEditing={false}
              updateAddress={async () => {}}
              setIsEditing={() => {}}
            />
          </div>
        </div>

        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Payment Method'
              cta={paymentOptionCta}
              fields={paymentOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderForm;
