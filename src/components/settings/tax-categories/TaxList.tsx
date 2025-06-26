'use client';

import { ITax } from '@/core/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { TableCellTypes } from '@/components/tables/TableCells';
import BasicTableOne from '@/components/tables/BasicTableOne';

interface TaxListProps {
  hits?: ITax[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const TaxList: FC<TaxListProps> = ({ hits = [], ...rest }) => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const headingData: string[] = ['Name', 'Id', 'Rate', 'Status'];

  const goToRoleDetails = (variantId: string) =>
    start(() => router.push(`/settings/tax-categories/${variantId}`));

  const tableData =
    hits?.map((tax) => [
      {
        type: TableCellTypes.TextCell,
        text: tax.name,
        onclick: () => goToRoleDetails(tax?.id || ''),
      },
      {
        type: TableCellTypes.TextCell,
        text: tax.id,
        onclick: () => goToRoleDetails(tax?.id || ''),
      },
      {
        type: TableCellTypes.TextCell,
        text: tax.fixed ? tax.rate : tax.rate + ' %',
      },
      {
        type: TableCellTypes.StatusCell,
        status: tax.active ? 'Online' : 'Offline',
        color: tax.active ? 'success' : 'dark',
      },
    ]) || [];
  return (
    <BasicTableOne
      headingData={headingData}
      tableData={tableData}
      pageProps={rest}
      isEmpty={!hits?.length}
    />
  );
};

export default TaxList;
