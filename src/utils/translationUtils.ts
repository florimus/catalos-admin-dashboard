import { IAttributes } from '@/core/types';

export const getTranslationFieldsFromAttributes = (attributes: IAttributes) => {
  if (attributes) {
    return Object.keys(attributes)?.filter(
      (key) => attributes[key]?.type === 'Text'
    );
  } else {
    return [];
  }
};

export const getTranslationLanguagesOptions = (
  translations: {
    code: string;
    name: string;
  }[]
) => {
  if (translations) {
    return translations.map((translation) => ({
      value: translation.code,
      label: translation.name,
    }));
  } else {
    return [];
  }
};
