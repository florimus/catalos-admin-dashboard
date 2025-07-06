export const formatSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

export const formatPrice: (value: number, locale: string) => string = (
  value: number,
  locale: string = 'en-IN'
) => {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};
