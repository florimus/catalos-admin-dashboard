'use server';

import { getModuleById } from '@/actions/module';
import { getPriceBySku } from '@/actions/price';
import { getProductById } from '@/actions/product';
import { getProductTypeById } from '@/actions/product-type';
import { getStockByVariantId } from '@/actions/stock';
import { getVariantById } from '@/actions/variant';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PriceForm from '@/components/prices/PriceForm';
import StockForm from '@/components/stocks/StockForm';
import VariantForm from '@/components/variants/VariantForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import SecureComponent from '@/core/authentication/SecureComponent';
import {
  IModule,
  IPrice,
  IProduct,
  IProductType,
  IResponse,
  IStock,
  IVariant,
} from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Variant | Catalos Admin',
  };
}

export default async function EditVariant(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('VAR:LS');
  const awaitedParam = await ctx.params;

  const variantResponse: IResponse<IVariant> = await getVariantById(
    awaitedParam.id
  );

  if (!variantResponse.success || !variantResponse.data) {
    console.error(variantResponse.message);
    redirect('/404');
  }

  const variant: IVariant = variantResponse.data;

  const productResponse: IResponse<IProduct> = await getProductById(
    variant.productId!
  );

  if (!productResponse.success || !productResponse.data) {
    console.error(productResponse.message);
    redirect('/404');
  }

  const product: IProduct = productResponse.data;

  const productTypeResponse: IResponse<IProductType> = await getProductTypeById(
    product.productTypeId
  );

  if (!productTypeResponse.success || !productTypeResponse.data) {
    console.error(productTypeResponse.message);
    redirect('/404');
  }

  const productType: IProductType = productTypeResponse.data;

  const stocks: IResponse<IStock> = await getStockByVariantId(variant.id);
  const price: IResponse<IPrice> = await getPriceBySku(variant.skuId);

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/products/${product.id}` },
    { label: 'Create Variant', href: '#' },
  ];

  const contentModule: IResponse<IModule> = await getModuleById(
    awaitedParam.id
  );

  return (
    <>
      <PageBreadcrumb
        pageTitle={`${variant.name} | ${product.name}`}
        backUrl={
          variant.productId ? `/products/${variant.productId}` : '/products'
        }
        items={breadCrumbItems}
      />
      <VariantForm
        product={product}
        productType={productType}
        variant={variant}
        contentModule={contentModule?.data}
      >
        <SecureComponent permission='STK:LS'>
          <StockForm variantId={variant.id} stockInfo={stocks?.data} />
        </SecureComponent>
        <SecureComponent permission='PRZ:LS'>
          <PriceForm priceInfo={price?.data} skuId={variant?.skuId} />
        </SecureComponent>
      </VariantForm>
    </>
  );
}
