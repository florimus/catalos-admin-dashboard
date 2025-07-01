import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/core/constants';

export const getFormattedDateTime = (date: string) => {
  return dayjs(date).format(DATE_TIME_FORMAT);
};

export const getFormattedDate = (date: string) => {
  return dayjs(date).format(DATE_FORMAT);
};