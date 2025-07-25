import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/core/constants';

export const getFormattedDateTime = (date: Date | string) => {
  return dayjs(date).format(DATE_TIME_FORMAT);
};

export const getFormattedDate = (date: Date | string) => {
  return dayjs(date).format(DATE_FORMAT);
};