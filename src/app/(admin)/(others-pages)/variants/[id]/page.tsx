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
import { validatePagePermissions } from '@/core/authentication/roleValidations';
import {
  IModule,
  IPrice,
  IProduct,
  IProductType,
  IResponse,
  IStock,
  IVariant,
} from '@/core/types';

export default async function EditVariant(ctx: { params: Promise<{ id: string }> }) {
  await validatePagePermissions('VAR:LS');
  const awaitedParam = await ctx.params;

  const variantResponse: IResponse<IVariant> = await getVariantById(
    awaitedParam.id
  );

  if (!variantResponse.success || !variantResponse.data) {
    return <div>Error fetching variant details.</div>;
  }

  const variant: IVariant = variantResponse.data;

  const productResponse: IResponse<IProduct> = await getProductById(
    variant.productId!
  );

  if (!productResponse.success || !productResponse.data) {
    return <div>Error fetching product details.</div>;
  }

  const product: IProduct = productResponse.data;

  const productTypeResponse: IResponse<IProductType> = await getProductTypeById(
    product.productTypeId
  );

  if (!productTypeResponse.success || !productTypeResponse.data) {
    return <div>Error fetching product type details.</div>;
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
        items={breadCrumbItems}
      />
      <VariantForm
        product={product}
        productType={productType}
        variant={variant}
        contentModule={contentModule?.data}
      >
        <StockForm variantId={variant.id} stockInfo={stocks?.data} />
        <PriceForm priceInfo={price?.data} skuId={variant?.skuId} />
      </VariantForm>
    </>
  );
}
