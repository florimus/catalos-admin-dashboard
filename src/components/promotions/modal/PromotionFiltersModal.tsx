'use client';

import DatePicker from '@/components/form/date-picker';
import MultiSelect from '@/components/form/MultiSelect';
import Switch from '@/components/form/switch/Switch';
import ContainerModal from '@/components/modals/ContainerModal';
import Button from '@/components/ui/button/Button';
import { IOrderSearchParams, OrderFilter } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { getFormattedDate } from '@/utils/timeUtils';
import { getSelectedStatuses } from '@/utils/urlMapper';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface ProductFiltersModalProps {
  searchParams: IOrderSearchParams | null;
}

const multiOptions = [
  { value: '1', text: 'InProgress', selected: false },
  { value: '2', text: 'Submitted', selected: false },
  { value: '3', text: 'Fulfilled', selected: false },
  { value: '4', text: 'Shipped', selected: false },
  { value: '5', text: 'Delivered', selected: false },
  { value: '6', text: 'Returned', selected: false },
  { value: '7', text: 'Refunded', selected: false },
  { value: '8', text: 'Cancelled', selected: false },
];

const ProductFiltersModal: FC<ProductFiltersModalProps> = ({ searchParams }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const findSelectedStatusOptions = (statuses: string[]) => {
    return multiOptions
      .filter((option) => statuses.includes(option.text))
      ?.map((option) => option.value);
  };

  const [filters, setFilter] = useState<OrderFilter | null>({
    statuses: findSelectedStatusOptions(
      getSelectedStatuses(searchParams?.statuses as unknown as string)
    ),
    fromDate: searchParams?.fromDate,
    toDate: searchParams?.toDate,
    excludeStatuses: Boolean(
      (searchParams?.excludeStatuses as unknown as string) === 'true'
    ),
  });

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const findStatusOptions = (statuses: string[]) => {
    setSelectedValues(statuses);
    return multiOptions
      .filter((option) => statuses.includes(option.value))
      ?.map((option) => option.text);
  };

  const handleSwitchChange = (checked: boolean) => {
    setFilter((prev) => ({ ...prev, excludeStatuses: checked }));
  };

  const handleSelectChange = (values: string[]) => {
    setFilter((prev) => ({ ...prev, statuses: findStatusOptions(values) }));
  };

  const handleDateRangeChange = (from: Date, to: Date) => {
    if (from && to) {
      setFilter((prev) => ({
        ...prev,
        fromDate: getFormattedDate(from),
        toDate: getFormattedDate(to),
      }));
    }
  };

  const handleApplyFilters = () => {
    const url = new URL(window.location.href);
    if (filters?.statuses) {
      url.searchParams.set('statuses', filters?.statuses?.join(',') || '');
    }
    if (filters?.fromDate) {
      url.searchParams.set('fromDate', filters?.fromDate || '');
    }
    if (filters?.toDate) {
      url.searchParams.set('toDate', filters?.toDate || '');
    }
    if (filters?.excludeStatuses?.toString()) {
      url.searchParams.set(
        'excludeStatuses',
        filters?.excludeStatuses?.toString() || ''
      );
    }
    router.push(url.toString());
    closeModal();
  };

  const handleClearFilters = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('statuses');
    url.searchParams.delete('query');
    url.searchParams.delete('fromDate');
    url.searchParams.delete('toDate');
    url.searchParams.delete('excludeStatuses');
    router.push(url.toString());
    closeModal();
  };

  return (
    <>
      <Button
        onClick={openModal}
        size='sm'
      >
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
          title='Order filters'
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
              defaultDate={`${filters?.fromDate} to ${filters?.toDate}`}
              onChange={(dates) =>
                handleDateRangeChange(dates?.[0], dates?.[1])
              }
            />
          </div>
          <div className='relative my-6'>
            <MultiSelect
              label='Order Statuses'
              options={multiOptions}
              defaultSelected={filters?.statuses || []}
              onChange={(values) => handleSelectChange(values)}
            />
            <p className='sr-only'>
              Selected Values: {selectedValues.join(', ')}
            </p>
          </div>
          <Switch
            label='Exclude Statuses'
            defaultChecked={filters?.excludeStatuses}
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
