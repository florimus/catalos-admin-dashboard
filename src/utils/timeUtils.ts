import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
} from '@/core/constants';

export const getFormattedDateTime = (date: Date | string) => {
  return dayjs(date).format(DATE_TIME_FORMAT);
};

export const getFormattedDate = (date: Date | string) => {
  return dayjs(date).format(DATE_FORMAT);
};

export const getUTCDate = (date: Date | string) => {
  const parsed = dayjs(date, DATE_FORMAT);
  if (!parsed.isValid()) return null;
  return parsed.startOf('day').toISOString();
};
