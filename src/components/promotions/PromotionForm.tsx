'use client';

import {
  IBrand,
  ICategory,
  IPromotion,
  IPromotionSearchProduct,
} from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useEffect, useState } from 'react';
import { channelToSingleSelectMapper } from '@/utils/mapperUtils';
import { CHANNELS } from '@/core/constants';
import FormInModal from '../modals/FormInModal';
import { useModal } from '@/hooks/useModal';
import Input from '../form/input/InputField';
import { productStatusUpdateApi } from '@/actions/product';
import Alert from '../ui/alert/Alert';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/actions/category';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { getBrands } from '@/actions/brand';
import Button from '../ui/button/Button';
import { ArrowRightIcon } from '@/icons';
import { getFormattedDate } from '@/utils/timeUtils';
import Radio from '../form/input/Radio';
import AssociatedProducts from './associations/AssociatedProducts';
import Avatar from '../ui/avatar/Avatar';
import { searchPromotionProducts } from '@/actions/promotions';
import AssociatedCategories from './associations/AssociatedCategories';
import AssociatedBrands from './associations/AssociatedBrands';

interface PromotionFormProps {
  productTypeOptions?: { value: string; label: string }[];
  promotion?: IPromotion;
  promotionProducts?: IPromotionSearchProduct[];
  promotionCategories?: ICategory[];
  promotionBrands?: IBrand[];
  initialCategories?: ICategory[];
  initialBrands?: IBrand[];
  permission?: string;
}

const discountModeOptions = [
  { value: 'Auto', label: 'Auto' },
  { value: 'Coupon', label: 'Coupon' },
];

const discountTypeOptions = [
  { value: 'FlatOFF', label: 'Flat OFF' },
  { value: 'PercentageOFF', label: 'Percentage OFF' },
  // { value: 'BuyXGetY', label: 'Buy X Get Y' },
];

const PromotionForm: FC<PromotionFormProps> = ({
  promotion,
  promotionProducts,
  promotionCategories,
  promotionBrands,
  permission,
}) => {
  const {
    isOpen: isProductPromotionModalOpen,
    openModal: productPromotionModal,
    closeModal: closeProductPromotionModal,
  } = useModal();

  const [tab, setTab] = useState<'PRODUCT' | 'CATEGORY' | 'BRAND'>('PRODUCT');

  const {
    isOpen: isCategoryOpen,
    openModal: openCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal();

  const {
    isOpen: isBrandOpen,
    openModal: openBrandModal,
    closeModal: closeBrandModal,
  } = useModal();

  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

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

  const [promotionForm, setPromotionForm] = useState<IPromotion>(
    promotion as IPromotion
  );

  const [promotionCriteria, setPromotionCriteria] = useState<{
    promotionProducts: IPromotionSearchProduct[];
    promotionCategories: ICategory[];
    promotionBrands: IBrand[];
  }>({
    promotionProducts: promotionProducts || [],
    promotionCategories: promotionCategories || [],
    promotionBrands: promotionBrands || [],
  });

  const [searchedProducts, setSearchedProducts] = useState<
    IPromotionSearchProduct[]
  >([]);

  const [categories, setCategories] = useState<ICategory[]>([]);

  const [brands, setBrands] = useState<IBrand[]>([]);

  const handleFilterProductVariants = (
    promotionProduct: IPromotionSearchProduct
  ) => {
    const variantIds = promotionProduct?.variants
      ?.filter((each) => each.status === 'Selected')
      ?.map((each) => each.id);

    if (variantIds?.length === 0) {
      return null;
    }

    const isAllVariantSelected: boolean =
      variantIds?.length === promotionProduct?.variants?.length;

    return {
      productId: isAllVariantSelected ? promotionProduct?.productId : null,
      variants: !isAllVariantSelected ? variantIds : null,
    };
  };

  const handleAddNewProductCriteriaFromSearch = (
    product: IPromotionSearchProduct
  ) => {
    setPromotionCriteria((prev) => {
      return {
        ...prev,
        promotionProducts: [
          ...prev?.promotionProducts,
          {
            ...product,
            variants: product?.variants?.map((each) => ({
              ...each,
              status: 'Selected',
            })),
          },
        ],
      };
    });
  };

  const handleAddNewCategoryCriteriaFromSearch = (category: ICategory) => {
    setPromotionCriteria((prev) => {
      return {
        ...prev,
        promotionCategories: [...prev?.promotionCategories, category],
      };
    });
  };

  const handleAddNewBrandCriteriaFromSearch = (category: IBrand) => {
    setPromotionCriteria((prev) => {
      return {
        ...prev,
        promotionBrands: [...prev?.promotionBrands, category],
      };
    });
  };

  const handleProductCriteria = () => {
    const requestCriteria: {
      targetedProductIds: string[];
      targetedVariantIds: string[];
      targetedCategories: string[];
      targetedBrands: string[];
    } = {
      targetedProductIds: [],
      targetedVariantIds: [],
      targetedCategories: [],
      targetedBrands: [],
    };
    promotionCriteria?.promotionProducts?.map((product) => {
      const productFilter = handleFilterProductVariants(product);
      if (productFilter?.productId) {
        requestCriteria.targetedProductIds.push(productFilter.productId || '');
      }
      if (productFilter?.variants) {
        requestCriteria.targetedVariantIds.push(...productFilter.variants);
      }
    });

    promotionCriteria?.promotionCategories?.map((category) => {
      requestCriteria.targetedCategories.push(category?.id || '');
    });

    promotionCriteria?.promotionBrands?.map((brand) => {
      requestCriteria.targetedBrands.push(brand?.id || '');
    });
    return requestCriteria;
  };

  const handleSave = async () => {
    const productCriteria = handleProductCriteria();
    console.log({ ...promotion, ...productCriteria });

    // const method = promotion?.id ? updateProductApi : createProductAPI;
    // const response = await method({
    //   id: promotion?.id || '',
    //   ...promotionForm,
    //   attributes: formatAttributeValues(productAttributes),
    // });
    // setLoading(false);
    // setAlerts([
    //   {
    //     message:
    //       response.message ||
    //       (response.success
    //         ? 'Product saved successfully'
    //         : 'Failed to save product'),
    //     variant: response.success ? 'success' : 'error',
    //   },
    // ]);
    // if (!promotion?.id && response.success) {
    //   start(() => router.push(`/products/${response.data?.id}`));
    // }
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await productStatusUpdateApi(promotion?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Product status updated successfully',
          variant: 'success',
        },
      ]);
      setPromotionForm((prev) => ({
        ...prev,
        active,
      }));
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to update product status',
          variant: 'error',
        },
      ]);
    }
  };

  const handleCategorySearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setCategories([]);
      return;
    }
    const response = await getCategories(event.target.value);
    if (response.success && response.data?.hits) {
      setCategories(response.data.hits);
    }
  };

  const handleBrandSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setBrands([]);
      return;
    }
    const response = await getBrands(event.target.value);
    if (response.success && response.data?.hits) {
      setBrands(response.data?.hits);
    }
  };

  const handleProductTypeSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setSearchedProducts([]);
      return;
    }
    const response = await searchPromotionProducts(
      event.target.value,
      promotion?.targetedProductIds || [],
      promotion?.targetedVariantIds || [],
      promotion?.availableChannel || ''
    );

    console.log(response);

    if (response.success && Array.isArray(response.data)) {
      setSearchedProducts(response.data);
    }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Promotion name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromotionForm((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: promotionForm.name,
      placeholder: 'Lucci vasqqi...',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid Promotion name',
    },
    {
      fieldType: FormFieldType.DropDown,
      name: 'discountMode',
      label: 'Discount Mode',
      onChange: (value: 'Auto' | 'Coupon') => {
        setPromotionForm((prev) => ({
          ...prev,
          discountMode: value,
        }));
      },
      options: discountModeOptions,
      defaultValue: promotionForm.discountMode,
      placeholder: 'Select discountMode',
      id: 'discountMode',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid discountMode',
    },
    {
      fieldType: FormFieldType.DropDown,
      name: 'discountType',
      label: 'Discount Type',
      onChange: (value: 'FlatOFF' | 'PercentageOFF' | 'BuyXGetY') => {
        setPromotionForm((prev) => ({
          ...prev,
          discountType: value,
        }));
      },
      options: discountTypeOptions,
      defaultValue: promotionForm.discountType,
      placeholder: 'Select discountType',
      id: 'discountType',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid discount Type',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'discountValue',
      label: 'DiscountValue',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromotionForm((prev) => ({
          ...prev,
          discountValue: event.target.value ? Number(event.target.value) : 0,
        }));
      },
      value: promotionForm.discountValue,
      placeholder: 'discount value',
      id: 'discountValue',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid Promotion name',
    },
    promotionForm.discountType === 'PercentageOFF' && {
      fieldType: FormFieldType.Text,
      name: 'maxDiscountPrice',
      label: 'Max Discount Price',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromotionForm((prev) => ({
          ...prev,
          maxDiscountPrice: event.target.value ? Number(event.target.value) : 0,
        }));
      },
      value: promotionForm.maxDiscountPrice,
      placeholder: 'Max Discount Price',
      id: 'maxDiscountPrice',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid Promotion name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'minItemQuantity',
      label: 'Min Item Quantity',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setPromotionForm((prev) => ({
          ...prev,
          minItemQuantity: event.target.value ? Number(event.target.value) : 0,
        }));
      },
      value: promotionForm.minItemQuantity,
      placeholder: 'Min Item Quantity',
      id: 'minItemQuantity',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please minItemQuantity Promotion name',
    },
    {
      fieldType: FormFieldType.DropDown,
      name: 'availableChannel',
      label: 'Select Channel',
      options: channelToSingleSelectMapper(CHANNELS),
      defaultValue: promotionForm.availableChannel,
      onChange: (selected: string) => {
        setPromotionForm((prev) => ({
          ...prev,
          availableChannel: selected,
        }));
      },
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : promotionForm.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: promotion?.id ? false : true,
    checked: promotionForm.active || false,
    onChange: (checked: boolean) => handleProductStatusUpdate(checked),
  };

  const promotionDateFields = [
    {
      fieldType: FormFieldType.DatePicker,
      name: 'startDate',
      label: 'Start Date',
      required: true,
      disabled: false,
      defaultDate: getFormattedDate(promotionForm.startDate),
      mode: 'single',
      onChange: (dates: { dates: Date[]; currentDateString: string }) => {
        setPromotionForm((prev) => ({
          ...prev,
          startDate: dates?.currentDateString,
        }));
      },
    },
    {
      fieldType: FormFieldType.DatePicker,
      name: 'expireDate',
      label: 'Expire Date',
      required: true,
      disabled: false,
      defaultDate: getFormattedDate(promotionForm.expireDate),
      mode: 'single',
      onChange: (dates: { dates: Date[]; currentDateString: string }) => {
        setPromotionForm((prev) => ({
          ...prev,
          expireDate: dates?.currentDateString,
        }));
      },
    },
  ];

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
              permission,
              label: 'Save Promotion',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Promotion Form'
            fields={fields}
          />
          {promotion?.id && (
            <>
              <div
                className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-5 p-3`}
              >
                <div className='flex flex-wrap items-center gap-8'>
                  <Radio
                    id='products_option'
                    name='products'
                    value='products'
                    checked={tab === 'PRODUCT'}
                    onChange={() => setTab('PRODUCT')}
                    label='Associated Products'
                  />
                  <Radio
                    id='categories_option'
                    name='categories'
                    value='categories'
                    checked={tab === 'CATEGORY'}
                    onChange={() => setTab('CATEGORY')}
                    label='Associated Categories'
                  />
                  <Radio
                    id='brands_option'
                    name='brands'
                    value='categories'
                    checked={tab === 'BRAND'}
                    onChange={() => setTab('BRAND')}
                    label='Associated Brands'
                  />
                </div>
              </div>
              <div
                className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-10 p-3`}
              >
                {tab === 'PRODUCT' && (
                  <AssociatedProducts
                    promotionId={promotion?.id}
                    promotionProducts={promotionCriteria.promotionProducts}
                    setPromotionCriteria={setPromotionCriteria}
                    productPromotionModal={productPromotionModal}
                  />
                )}
                {tab === 'CATEGORY' && (
                  <AssociatedCategories
                    promotionId={promotion?.id}
                    promotionCategories={promotionCriteria.promotionCategories}
                    setPromotionCriteria={setPromotionCriteria}
                    openCategoryModal={openCategoryModal}
                  />
                )}
                {tab === 'BRAND' && (
                  <AssociatedBrands
                    promotionId={promotion?.id}
                    promotionBrands={promotionCriteria.promotionBrands}
                    setPromotionCriteria={setPromotionCriteria}
                    openCategoryModal={openBrandModal}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Promotion Status'
              fields={[productStatusFields]}
            />
            <div className='flex justify-end w-full mb-4'>
              <Button
                size='sm'
                className='my-1 flex w-full'
                onClick={() =>
                  start(() =>
                    router.push(`/products/${promotion?.id}/translations`)
                  )
                }
              >
                Manage Translations <ArrowRightIcon />
              </Button>
            </div>
            <DefaultInputs
              heading='Promotion Dates'
              fields={promotionDateFields}
            />
          </div>
        </div>
      </div>
      {isProductPromotionModalOpen && (
        <FormInModal
          title='Select Promotion Products'
          isOpen={isProductPromotionModalOpen}
          closeModal={closeProductPromotionModal}
          size='wide'
        >
          <Input
            type='text'
            placeholder='Search Products'
            name='productTypeId'
            onChange={handleProductTypeSearch}
          />
          <ul>
            {searchedProducts.map((each) => {
              const selectedProducts =
                promotionCriteria?.promotionProducts?.map(
                  (each) => each?.productId
                );
              const isSelected =
                each?.variants?.some((each) => each.status === 'Selected') ||
                selectedProducts?.includes(each?.productId);
              return (
                <li
                  key={each.productId}
                  className='hover:bg-gray-100 dark:hover:bg-gray-800 p-3 mt-2.5 text-gray-800 dark:text-white rounded-md py-5 flex'
                >
                  <div className='w-full'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        {isSelected ? (
                          <p className='muted border border-dashed border-gray-400 dark:border-gray-600 p-2 px-4 rounded text-gray-400 dark:text-gray-600 flex justify-between items-center gap-4'>
                            <svg
                              width='16px'
                              height='16px'
                              className='fill-gray-500 dark:fill-gray-400'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                              <g
                                id='SVGRepo_tracerCarrier'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                stroke='#CCCCCC'
                                strokeWidth='0.192'
                              ></g>
                              <g id='SVGRepo_iconCarrier'>
                                <path
                                  d='M2 0H14V16H12L8 12L4 16H2V0Z'
                                  fill=''
                                ></path>
                              </g>
                            </svg>
                            Saved
                          </p>
                        ) : (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() =>
                              handleAddNewProductCriteriaFromSearch(each)
                            }
                          >
                            Select
                          </Button>
                        )}
                        <p
                          className={`font-semibold ${
                            isSelected && 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {each?.productName}
                        </p>
                      </div>
                      <div className='flex gap-1 relative'>
                        {each?.variants?.map((variant) => (
                          <Avatar key={variant?.id} src={variant?.thumbnail} />
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </FormInModal>
      )}
      {isCategoryOpen && (
        <FormInModal
          title='Select Category'
          isOpen={isCategoryOpen}
          closeModal={closeCategoryModal}
        >
          <Input
            type='text'
            placeholder='Select Category'
            name='categoryIdModal'
            onChange={handleCategorySearch}
          />
          <ul>
            {categories.map((category) => {
              const selectedCategories =
                promotionCriteria?.promotionCategories?.map((each) => each?.id);
              const isSelected = selectedCategories?.includes(category?.id);
              return (
                <li
                  key={category.id}
                  className='hover:bg-gray-100 dark:hover:bg-gray-800 p-3 mt-2.5 text-gray-800 dark:text-white rounded-md py-5 flex'
                >
                  <div className='w-full'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        {isSelected ? (
                          <p className='muted border border-dashed border-gray-400 dark:border-gray-600 p-2 px-4 rounded text-gray-400 dark:text-gray-600 flex justify-between items-center gap-4'>
                            <svg
                              width='16px'
                              height='16px'
                              className='fill-gray-500 dark:fill-gray-400'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                              <g
                                id='SVGRepo_tracerCarrier'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                stroke='#CCCCCC'
                                strokeWidth='0.192'
                              ></g>
                              <g id='SVGRepo_iconCarrier'>
                                <path
                                  d='M2 0H14V16H12L8 12L4 16H2V0Z'
                                  fill=''
                                ></path>
                              </g>
                            </svg>
                            Saved
                          </p>
                        ) : (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() =>
                              handleAddNewCategoryCriteriaFromSearch(category)
                            }
                          >
                            Select
                          </Button>
                        )}
                        <p
                          className={`font-semibold ${
                            isSelected && 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {category?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </FormInModal>
      )}
      {isBrandOpen && (
        <FormInModal
          title='Select Brand'
          isOpen={isBrandOpen}
          closeModal={closeBrandModal}
        >
          <Input
            type='text'
            placeholder='Select Brand'
            name='brandIdModal'
            onChange={handleBrandSearch}
          />
          <ul>
            {brands.map((brand) => {
              const selectedBrands = promotionCriteria?.promotionBrands?.map(
                (each) => each?.id
              );
              const isSelected = selectedBrands?.includes(brand?.id);
              return (
                <li
                  key={brand.id}
                  className='hover:bg-gray-100 dark:hover:bg-gray-800 p-3 mt-2.5 text-gray-800 dark:text-white rounded-md py-5 flex'
                >
                  <div className='w-full'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        {isSelected ? (
                          <p className='muted border border-dashed border-gray-400 dark:border-gray-600 p-2 px-4 rounded text-gray-400 dark:text-gray-600 flex justify-between items-center gap-4'>
                            <svg
                              width='16px'
                              height='16px'
                              className='fill-gray-500 dark:fill-gray-400'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                              <g
                                id='SVGRepo_tracerCarrier'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                stroke='#CCCCCC'
                                strokeWidth='0.192'
                              ></g>
                              <g id='SVGRepo_iconCarrier'>
                                <path
                                  d='M2 0H14V16H12L8 12L4 16H2V0Z'
                                  fill=''
                                ></path>
                              </g>
                            </svg>
                            Saved
                          </p>
                        ) : (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() =>
                              handleAddNewBrandCriteriaFromSearch(brand)
                            }
                          >
                            Select
                          </Button>
                        )}
                        <p
                          className={`font-semibold ${
                            isSelected && 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {brand?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </FormInModal>
      )}
    </>
  );
};

export default PromotionForm;
