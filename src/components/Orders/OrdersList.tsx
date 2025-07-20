'use client';

import { IMiniOrder } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { getFormattedDate } from '@/utils/timeUtils';
import { getChannelId } from '@/utils/mapperUtils';
import Badge from '../ui/badge/Badge';

interface OrdersListProps {
  hits?: IMiniOrder[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const OrderList: React.FC<OrdersListProps> = ({ hits = [], ...rest }) => {
  const headingData: string[] = [
    'Customer',
    'Channel',
    'Status',
    'LineItems',
    'Total',
    'Created Date',
    'Updated Date',
  ];

  const router = useRouter();
  const { start } = useGlobalLoader();

  const statusBadges = (status: string) => {
    switch (status) {
      case 'InProgress':
        return <Badge color='warning'>In Progress</Badge>;
      case 'Submitted':
        return <Badge color='info'>Submitted</Badge>;
      case 'Fulfilled':
        return <Badge color='success'>Fulfilled</Badge>;
      default:
        return '';
    }
  };

  const goToCartDetails = (status: string, orderId: string) =>
    start(() =>
      router.push(`/${status === 'InProgress' ? 'carts' : 'orders'}/${orderId}`)
    );

  const tableData =
    hits?.map((order) => [
      {
        type: TableCellTypes.TextCell,
        text: order.email || 'Anonymous',
        onclick: () => goToCartDetails(order.status, order.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: getChannelId(order.channelId)?.name,
        onclick: () => goToCartDetails(order.status, order.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: statusBadges(order.status),
        onclick: () => goToCartDetails(order.status, order.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: order.lineItems?.length,
      },
      {
        type: TableCellTypes.TextCell,
        text: order.price?.grandTotalPrice,
      },
      {
        type: TableCellTypes.TextCell,
        text: order.updatedAt ? getFormattedDate(order.createdAt) : '-',
      },
      {
        type: TableCellTypes.TextCell,
        text: order.updatedAt ? getFormattedDate(order.updatedAt) : '-',
      },
    ]) || [];

  return (
    <BasicTableOne
      headingData={headingData}
      tableData={tableData}
      pageProps={rest}
      isEmpty={hits.length === 0}
    />
  );
};

export default OrderList;
