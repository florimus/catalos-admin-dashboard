'use server';

import { getBrandById } from '@/actions/brand';
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
  getTranslationLanguagesOptions,
} from '@/utils/translationUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Brand Translations | Catalos Admin',
  };
}

const BrandTranslations = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ITranslationParams | null>;
}) => {
  await validatePermissions('BRD:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ITranslationParams | null =
    (await ctx.searchParams) || {};
  const selectedLanguage = searchParams?.code || DEFAULT_TRANSLATION_LANGUAGE;

  const [brand, translations] = await Promise.all([
    getBrandById(awaitedParams.id),
    getTranslationByUniqueIdAndLanguage(
      awaitedParams.id || '',
      selectedLanguage
    ),
  ]);

  if (!brand?.success || !brand?.data) {
    console.error(brand.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Brands', href: '/brands' },
    { label: brand?.data?.name, href: `/brands/${awaitedParams.id}` },
    { label: 'translations', href: '#' },
  ];

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Translations - ${brand?.data?.name} - ${selectedLanguage}`}
        items={breadCrumbItems}
        backUrl={`/brands/${awaitedParams.id}`}
      />
      <TranslationForm
        permission='BRD:NN'
        pageTranslationsFields={TRANSLATION_FIELDS.BRAND}
        uniqueId={awaitedParams.id}
        translations={translations.data}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default BrandTranslations;
