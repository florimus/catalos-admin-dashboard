'use server';

import { getProductTypeById } from '@/actions/product-type';
import { getTranslationByUniqueIdAndLanguage } from '@/actions/translation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TranslationForm from '@/components/translations/TranslationForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import {
  CHANNELS,
  DEFAULT_TRANSLATION_LANGUAGE,
  TRANSLATION_FIELDS,
} from '@/core/constants';
import { ITranslationParams } from '@/core/types';
import {
  getTranslationFieldsFromProductTypes,
  getTranslationLanguagesOptions,
} from '@/utils/translationUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Product Type Translations | Catalos Admin',
  };
}

const ProductTypeTranslations = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ITranslationParams | null>;
}) => {
  await validatePermissions('PTY:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ITranslationParams | null =
    (await ctx.searchParams) || {};
  const selectedLanguage = searchParams?.code || DEFAULT_TRANSLATION_LANGUAGE;

  const [productType, translations] = await Promise.all([
    getProductTypeById(awaitedParams.id),
    getTranslationByUniqueIdAndLanguage(
      awaitedParams.id || '',
      selectedLanguage
    ),
  ]);

  if (!productType?.success || !productType?.data) {
    console.error(productType.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Product Types', href: '/product-types' },
    { label: productType?.data?.name, href: `/product-types/${awaitedParams.id}` },
    { label: 'translations', href: '#' },
  ];

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

  const productAttributeFields = getTranslationFieldsFromProductTypes(
    productType?.data?.productAttributes
  );

  const variantAttributeFields = getTranslationFieldsFromProductTypes(
    productType?.data?.variantAttributes
  );

  const translationFields = [
    ...(productAttributeFields?.flat() || []),
    ...(variantAttributeFields?.flat() || []),
  ] as string[];
  

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Translations - ${productType?.data?.name} - ${selectedLanguage}`}
        items={breadCrumbItems}
        backUrl={`/product-types/${awaitedParams.id}`}
      />
      <TranslationForm
        permission='PTY:NN'
        pageTranslationsFields={TRANSLATION_FIELDS.PRODUCT_TYPE}
        attributeFields={translationFields}
        uniqueId={awaitedParams.id}
        translations={translations.data}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default ProductTypeTranslations;
