'use server';

import { getCategoryById } from '@/actions/category';
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
    title: 'Category Translations | Catalos Admin',
  };
}

const CategoryTranslations = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ITranslationParams | null>;
}) => {
  await validatePermissions('VAR:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ITranslationParams | null =
    (await ctx.searchParams) || {};
  const selectedLanguage = searchParams?.code || DEFAULT_TRANSLATION_LANGUAGE;

  const [category, translations] = await Promise.all([
    getCategoryById(awaitedParams.id),
    getTranslationByUniqueIdAndLanguage(
      awaitedParams.id || '',
      selectedLanguage
    ),
  ]);

  if (!category?.success || !category?.data) {
    console.error(category.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Categories', href: '/categories' },
    { label: category?.data?.name, href: `/categories/${awaitedParams.id}` },
    { label: 'translations', href: '#' },
  ];

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Translations - ${category?.data?.name} - ${selectedLanguage}`}
        items={breadCrumbItems}
        backUrl={`/categories/${awaitedParams.id}`}
      />
      <TranslationForm
        permission='VAR:NN'
        pageTranslationsFields={TRANSLATION_FIELDS.CATEGORY}
        uniqueId={awaitedParams.id}
        translations={translations.data}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default CategoryTranslations;
