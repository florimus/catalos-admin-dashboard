'use client';

import { IPromotion } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { getFormattedDate } from '@/utils/timeUtils';
import { getChannelId } from '@/utils/mapperUtils';
import Badge from '../ui/badge/Badge';
import { formatPrice } from '@/utils/stringUtils';
import { InfoIcon } from '@/icons';
import ToolTip from '../ui/tooltip';

interface PromotionListProps {
  hits?: IPromotion[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const PromotionList: React.FC<PromotionListProps> = ({
  hits = [],
  ...rest
}) => {
  const headingData: string[] = [
    'Name',
    'Discount Mode',
    'Discount Type',
    'Status',
    'Discount Value',
    'Criteria',
    'Channel',
    'Start Date',
    'Expire Date',
  ];

  const router = useRouter();
  const { start } = useGlobalLoader();

  const getToolTip = (promotion: IPromotion) => {
    return (
      <span>
        Products: {promotion?.targetedProductIds?.length}, Categories:{' '}
        {promotion?.targetedCategories?.length}, <br />
        Brands: {promotion?.targetedBrands?.length}, Collections:{' '}
        {promotion?.targetedCollections?.length}
      </span>
    );
  };

  const goToPromotionDetails = (promotionId: string) =>
    start(() => router.push(`/promotions/${promotionId}`));

  const tableData =
    hits?.map((promotion) => [
      {
        type: TableCellTypes.TextCell,
        text: promotion.name || 'Anonymous',
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: promotion.discountMode,
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: promotion.discountType,
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: promotion.active ? (
          <Badge color='success'>Live</Badge>
        ) : (
          <Badge color='warning'>Off</Badge>
        ),
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text:
          promotion.discountType === 'PercentageOFF'
            ? `${promotion.discountValue} % ${
                promotion?.maxDiscountPrice > 0
                  ? `(Max. ${formatPrice(promotion?.maxDiscountPrice)})`
                  : ''
              }`
            : formatPrice(promotion.discountValue),
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: (
          <ToolTip info={getToolTip(promotion)}>
            <InfoIcon className='text-primary' />
          </ToolTip>
        ),
      },
      {
        type: TableCellTypes.TextCell,
        text: getChannelId(promotion.availableChannel)?.name,
        onclick: () => goToPromotionDetails(promotion.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: getFormattedDate(promotion.startDate),
      },
      {
        type: TableCellTypes.TextCell,
        text: getFormattedDate(promotion.expireDate),
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

export default PromotionList;
