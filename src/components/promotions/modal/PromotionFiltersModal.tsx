'use client';

import DatePicker from '@/components/form/date-picker';
import { DropDownFormField } from '@/components/form/form-elements/DefaultFormFields';
import Switch from '@/components/form/switch/Switch';
import ContainerModal from '@/components/modals/ContainerModal';
import Button from '@/components/ui/button/Button';
import { IPromotionFiler, IPromotionSearchParams } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { getFormattedDate } from '@/utils/timeUtils';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface ProductFiltersModalProps {
  searchParams: IPromotionSearchParams | null;
}

const discountModeOptions = [
  { value: 'Auto', label: 'Auto' },
  { value: 'Coupon', label: 'Coupon' },
];

const discountTypeOptions = [
  { value: 'FlatOFF', label: 'FlatOFF' },
  { value: 'PercentageOFF', label: 'PercentageOFF' },
  { value: 'BuyXGetY', label: 'BuyXGetY' },
];

const ProductFiltersModal: FC<ProductFiltersModalProps> = ({
  searchParams,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const [filters, setFilter] = useState<IPromotionFiler | null>({
    discountMode: searchParams?.discountMode,
    discountType: searchParams?.discountType,
    startDate: searchParams?.startDate,
    expireDate: searchParams?.expireDate,
    forAllProducts: searchParams?.forAllProducts || false,
  });

  const handleSwitchChange = (checked: boolean) => {
    setFilter((prev) => ({ ...prev, forAllProducts: checked }));
  };

  const handleSelectDiscountMode = (mode: 'Auto' | 'Coupon') => {
    setFilter((prev) => ({ ...prev, discountMode: mode }));
  };

  const handleSelectDiscountType = (
    type: 'FlatOFF' | 'PercentageOFF' | 'BuyXGetY'
  ) => {
    setFilter((prev) => ({ ...prev, discountType: type }));
  };

  const handleDateRangeChange = (from: Date, to: Date) => {
    if (from && to) {
      setFilter((prev) => ({
        ...prev,
        startDate: getFormattedDate(from),
        expireDate: getFormattedDate(to),
      }));
    }
  };

  const handleApplyFilters = () => {
    const url = new URL(window.location.href);
    if (filters?.discountMode) {
      url.searchParams.set('discountMode', filters.discountMode);
    }
    if (filters?.discountType) {
      url.searchParams.set('discountType', filters.discountType);
    }
    if (filters?.startDate) {
      url.searchParams.set('startDate', filters.startDate);
    }
    if (filters?.expireDate) {
      url.searchParams.set('expireDate', filters.expireDate);
    }

    url.searchParams.set('forAllProducts', filters?.forAllProducts?.toString() || 'false');
    if (filters?.targetedUserGroup) {
      url.searchParams.set('targetedUserGroup', filters.targetedUserGroup);
    }
    router.push(url.toString());
    closeModal();
  };

  const handleClearFilters = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('discountMode');
    url.searchParams.delete('discountType');
    url.searchParams.delete('startDate');
    url.searchParams.delete('expireDate');
    url.searchParams.delete('forAllProducts');
    url.searchParams.delete('targetedUserGroup');
    url.searchParams.delete('page');
    router.push(url.toString());
    closeModal();
  };

  return (
    <>
      <Button variant='outline' onClick={openModal} size='sm'>
        <svg
          className='stroke-current fill-white dark:fill-gray-800'
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2.29004 5.90393H17.7067'
            stroke=''
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.7075 14.0961H2.29085'
            stroke=''
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z'
            fill=''
            stroke=''
            strokeWidth='1.5'
          />
          <path
            d='M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z'
            fill=''
            stroke=''
            strokeWidth='1.5'
          />
        </svg>
        Filters
      </Button>
      {isOpen && (
        <ContainerModal
          title='Promotion filters'
          isOpen={isOpen}
          closeModal={closeModal}
        >
          <div>
            <DatePicker
              id='order-filter-date-range'
              mode='range'
              required={false}
              disabled={false}
              label='From Date'
              placeholder='From Date'
              defaultDate={`${filters?.startDate} to ${filters?.expireDate}`}
              onChange={(dates) =>
                handleDateRangeChange(dates?.[0], dates?.[1])
              }
            />
          </div>
          <div className='relative my-6'>
            <DropDownFormField
              name='discountMode'
              label='Discount Mode'
              required={false}
              disabled={false}
              options={discountModeOptions}
              defaultValue={filters?.discountMode}
              placeholder='Select an option'
              onChange={(values) =>
                handleSelectDiscountMode(values as 'Auto' | 'Coupon')
              }
            />
          </div>
          <div className='relative my-6'>
            <DropDownFormField
              name='discountType'
              label='Discount Type'
              required={false}
              disabled={false}
              options={discountTypeOptions}
              defaultValue={filters?.discountType}
              placeholder='Select an option'
              onChange={(values) =>
                handleSelectDiscountType(
                  values as 'FlatOFF' | 'PercentageOFF' | 'BuyXGetY'
                )
              }
            />
          </div>
          <Switch
            label='Apply to all products'
            defaultChecked={filters?.forAllProducts}
            onChange={handleSwitchChange}
          />
          <div className='flex items-center justify-end w-full gap-3 mt-6'>
            <Button size='sm' variant='outline' onClick={handleClearFilters}>
              clear
            </Button>
            <Button size='sm' disabled={false} onClick={handleApplyFilters}>
              Apply filters
            </Button>
          </div>
        </ContainerModal>
      )}
    </>
  );
};

export default ProductFiltersModal;
