'use server';

import { getBrands } from '@/actions/brand';
import { getCategories } from '@/actions/category';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PromotionForm from '@/components/promotions/PromotionForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import {
  IBrand,
  ICategory,
  IPage,
  IResponse,
} from '@/core/types';

export async function generateMetadata() {
  return {
    title: 'Promotion | Catalos Admin',
  };
}

export default async function CreatePromotion() {
  await validatePermissions('PRO:NN');


  const breadCrumbItems = [
    { label: 'Promotions', href: '/promotions' },
    { label: 'Create Promotion', href: '#' },
  ];


  const initialCategories: IResponse<IPage<ICategory>> = await getCategories();
  const initialBrands: IResponse<IPage<IBrand>> = await getBrands();

  return (
    <>
      <PageBreadcrumb
        pageTitle={'Create Promotion'}
        items={breadCrumbItems}
        backUrl='/promotions'
      />
      <PromotionForm
        permission='PRO:NN'
        initialCategories={initialCategories?.data?.hits || []}
        initialBrands={initialBrands?.data?.hits || []}
      />
    </>
  );
}
