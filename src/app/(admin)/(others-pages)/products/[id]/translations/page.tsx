'use server';

import { getProductById } from '@/actions/product';
import { getTranslationByUniqueIdAndLanguage } from '@/actions/translation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTranslationForm from '@/components/translations/ProductTranslationForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { CHANNELS, DEFAULT_TRANSLATION_LANGUAGE } from '@/core/constants';
import { IProduct, IResponse, ITranslation, ITranslationParams } from '@/core/types';
import {
  getTranslationFieldsFromAttributes,
  getTranslationLanguagesOptions,
} from '@/utils/translationUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Product Translations | Catalos Admin',
  };
}

const ProductTranslations = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ITranslationParams | null>;
}) => {
  await validatePermissions('PRD:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ITranslationParams | null =
    (await ctx.searchParams) || {};
  const selectedLanguage = searchParams?.code || DEFAULT_TRANSLATION_LANGUAGE;

  const product: IResponse<IProduct> = await getProductById(awaitedParams.id);

  if (!product?.success || !product?.data) {
    console.error(product.message);
    redirect('/404');
  }

  const translations: IResponse<ITranslation> = await getTranslationByUniqueIdAndLanguage(
    awaitedParams.id || '',
    selectedLanguage
  );

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'translations', href: '#' },
  ];

  const attributeFields = getTranslationFieldsFromAttributes(
    product.data?.attributes
  );

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );  

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Translations - ${product?.data?.name} - ${selectedLanguage}`}
        items={breadCrumbItems}
        backUrl={`/products/${awaitedParams.id}`}
      />
      <ProductTranslationForm
        attributeFields={attributeFields}
        uniqueId={awaitedParams.id}
        translations={translations.data}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default ProductTranslations;
