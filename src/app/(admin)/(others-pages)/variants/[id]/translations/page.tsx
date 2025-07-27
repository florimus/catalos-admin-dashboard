'use server';

import { getTranslationByUniqueIdAndLanguage } from '@/actions/translation';
import { getVariantById } from '@/actions/variant';
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
  getTranslationFieldsFromAttributes,
  getTranslationLanguagesOptions,
} from '@/utils/translationUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Variant Translations | Catalos Admin',
  };
}

const VariantTranslations = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ITranslationParams | null>;
}) => {
  await validatePermissions('VAR:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ITranslationParams | null =
    (await ctx.searchParams) || {};
  const selectedLanguage = searchParams?.code || DEFAULT_TRANSLATION_LANGUAGE;

  const [variant, translations] = await Promise.all([
    getVariantById(awaitedParams.id),
    getTranslationByUniqueIdAndLanguage(
      awaitedParams.id || '',
      selectedLanguage
    ),
  ]);

  if (!variant?.success || !variant?.data) {
    console.error(variant.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Variants', href: '/variants' },
    { label: 'translations', href: '#' },
  ];

  const attributeFields = getTranslationFieldsFromAttributes(
    variant.data?.attributes
  );

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Translations - ${variant?.data?.name} - ${selectedLanguage}`}
        items={breadCrumbItems}
        backUrl={`/variants/${awaitedParams.id}`}
      />
      <TranslationForm
        permission='VAR:NN'
        pageTranslationsFields={TRANSLATION_FIELDS.VARIANT}
        attributeFields={attributeFields}
        uniqueId={awaitedParams.id}
        translations={translations.data}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default VariantTranslations;
