'use client';

import { FC, useEffect, useState } from 'react';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import { ICategory, IPage, IProduct, ISearchParams } from '@/core/types';
import {
  createCategoryAPI,
  getCategories,
  updateCategoryById,
  updateCategoryStatus,
} from '@/actions/category';
import { categoryToSingleSelectMapper } from '@/utils/mapperUtils';
import { useModal } from '@/hooks/useModal';
import FormInModal from '../modals/FormInModal';
import Input from '../form/input/InputField';
import { useRouter } from 'next/navigation';
import Alert from '../ui/alert/Alert';
import TableCard from '../common/TableCard';
import CategoriesList from './CategoriesList';
import Radio from '../form/input/Radio';
import ProductList from '../products/ProductList';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import SecureComponent from '@/core/authentication/SecureComponent';
import Button from '../ui/button/Button';
import { ArrowRightIcon } from '@/icons';

interface CategoryFormProps {
  category?: ICategory;
  parentCategoryOption?: {
    label: string;
    value: string;
  };
  searchParams?: ISearchParams;
  associatedCategories?: IPage<ICategory>;
  initialCategoryList?: ICategory[];
  associatedProducts?: IPage<IProduct>;
}

const CategoryForm: FC<CategoryFormProps> = ({
  category,
  parentCategoryOption,
  searchParams,
  associatedCategories,
  initialCategoryList,
  associatedProducts,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [isCategoryTab, setIsCategoryTab] = useState<boolean>(true);

  const router = useRouter();
  const { start } = useGlobalLoader();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [categoryFormData, setCategoryFormData] = useState<ICategory>({
    id: category?.id || '',
    name: category?.name || '',
    parentId: category?.parentId || null,
    seoTitle: category?.seoTitle || '',
    seoDescription: category?.seoDescription || '',
    active: category?.active || false,
  });

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >(
    [
      ...(parentCategoryOption ? [parentCategoryOption] : []),
      ...categoryToSingleSelectMapper(initialCategoryList),
    ].flat()
  );

  const handleSave = async () => {
    setLoading(true);
    const method = category?.id ? updateCategoryById : createCategoryAPI;
    const response = await method({
      ...categoryFormData,
    });
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Product saved successfully'
            : 'Failed to save product'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!category?.id && response.success) {
      start(() => router.push(`/categories/${response.data?.id}`));
    }
  };

  const handleParentCategorySelect = (value: string) => {
    setCategoryFormData((prev) => ({
      ...prev,
      parentId: value,
    }));
    closeModal();
  };

  const handleCategorySearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setCategories(
        [
          ...(parentCategoryOption ? [parentCategoryOption] : []),
          ...categoryToSingleSelectMapper(initialCategoryList),
        ].flat()
      );
      return;
    }
    const response = await getCategories(event.target.value);
    if (response.success && response.data?.hits) {
      setCategories(categoryToSingleSelectMapper(response.data.hits));
    }
  };

  const handleCategoryStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await updateCategoryStatus(category?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Category status updated successfully',
          variant: 'success',
        },
      ]);
      setCategoryFormData((prev) => ({
        ...prev,
        active,
      }));
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to update category status',
          variant: 'error',
        },
      ]);
    }
  };

  const handleChangeTab = (tab: string) => {
    setIsCategoryTab(tab === 'categories');
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Category Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryFormData((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: categoryFormData.name,
      placeholder: 'Koui hammer...',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid category name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'seoTitle',
      label: 'Seo Title',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryFormData((prev) => ({
          ...prev,
          seoTitle: event.target.value,
        }));
      },
      value: categoryFormData.seoTitle,
      placeholder: 'All Koui hammer..',
      id: 'seoTitle',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid seoTitle',
    },
    {
      fieldType: FormFieldType.TextArea,
      name: 'seoDescription',
      label: 'Seo Description',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryFormData((prev) => ({
          ...prev,
          seoDescription: event.target.value,
        }));
      },
      value: categoryFormData.seoDescription,
      placeholder: 'Describe Koui hammer..',
      id: 'seoDescription',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid seoDescription',
    },
    {
      fieldType: FormFieldType.Display,
      name: 'parentId',
      label: 'Select Parent Category',
      required: true,
      disabled: false,
      value:
        categories.find(
          (category) => category.value === categoryFormData.parentId
        )?.label || 'Select Product Type',
      id: 'productTypeId',
      onClick: openModal,
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const categoryStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : categoryFormData.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: category?.id ? false : true,
    checked: categoryFormData.active || false,
    onChange: (checked: boolean) => handleCategoryStatusUpdate(checked),
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
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 my-6'>
        <div className='grid col-span-1 xl:col-span-2'>
          <DefaultInputs
            cta={{
              permission: 'CAT:NN',
              label: 'Save Category',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Category Form'
            fields={fields}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Category Status'
              fields={[categoryStatusFields]}
            />
            <div className='flex justify-end w-full'>
              <Button
                size='sm'
                className='my-1 mb-6 flex w-full'
                onClick={() =>
                  start(() =>
                    router.push(`/categories/${category?.id}/translations`)
                  )
                }
              >
                Manage Translations <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {category?.id && (
        <>
          <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-10 p-3`}
          >
            <div className='flex flex-wrap items-center gap-8'>
              <Radio
                id='categories_option'
                name='categories'
                value='categories'
                checked={isCategoryTab}
                onChange={handleChangeTab}
                label='Associated Categories'
              />
              <SecureComponent permission='PRD:LS'>
                <Radio
                  id='products_option'
                  name='products'
                  value='products'
                  checked={!isCategoryTab}
                  onChange={handleChangeTab}
                  label='Associated Products'
                />
              </SecureComponent>
            </div>
          </div>
          {isCategoryTab ? (
            <TableCard
              searchPlaceHolder={'Search Associated categories...'}
              searchParams={searchParams || {}}
            >
              <CategoriesList {...associatedCategories} />
            </TableCard>
          ) : (
            <TableCard
              searchPlaceHolder={'Search products...'}
              searchParams={searchParams || {}}
            >
              <ProductList {...associatedProducts} />
            </TableCard>
          )}
        </>
      )}
      {isOpen && (
        <FormInModal
          title='Select Parent Category'
          isOpen={isOpen}
          closeModal={closeModal}
        >
          <Input
            type='text'
            placeholder='Select Parent Category'
            name='parentId'
            onChange={handleCategorySearch}
          />
          <ul>
            {categories.map((type, index) => (
              <li
                key={`${type.value}_${index}`}
                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                onClick={() => handleParentCategorySelect(type.value)}
              >
                {type.label}
              </li>
            ))}
          </ul>
        </FormInModal>
      )}
    </>
  );
};

export default CategoryForm;
