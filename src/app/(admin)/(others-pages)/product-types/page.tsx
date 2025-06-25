'use server';

import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import ProductTypeList from '@/components/productTypes/ProductTypeList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IPage, IProductType, IResponse, ISearchParams } from '@/core/types';

const ProductTypeListPage = async (ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) => {
  await validatePermissions('PTY:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const cta = {
    label: 'New Product Type',
    href: '/product-types/create',
  };

  const response: IResponse<IPage<IProductType>> = await getProductTypeList(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch product-types:', response.message);
    return <div>Error fetching products: {response.message}</div>;
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle='Product Types'
        items={[{ label: 'Products Types', href: '/product-types' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search products types...'}
          searchParams={searchParams}
          cta={cta}
        >
          <ProductTypeList {...response.data} />
        </TableCard>
      </div>
    </>
  );
};

export default ProductTypeListPage;
