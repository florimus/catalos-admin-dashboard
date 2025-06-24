'use client';

import { IRole } from '@/core/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { TableCellTypes } from '@/components/tables/TableCells';
import BasicTableOne from '@/components/tables/BasicTableOne';
import Badge from '@/components/ui/badge/Badge';

interface RoleListProps {
  hits?: IRole[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const RoleList: FC<RoleListProps> = ({ hits = [], ...rest }) => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const headingData: string[] = ['Name', 'Unique Id', 'Type', 'Status'];

  const goToRoleDetails = (variantId: string) =>
    start(() => router.push(`/settings/roles-and-permissions/${variantId}`));

  const tableData =
    hits?.map((role) => [
      {
        type: TableCellTypes.TextCell,
        text: role.name,
        onclick: () => goToRoleDetails(role.uniqueId),
      },
      {
        type: TableCellTypes.TextCell,
        text: role.uniqueId,
        onclick: () => goToRoleDetails(role.uniqueId),
      },
      {
        type: TableCellTypes.TextCell,
        text: role.default ? (
          <Badge variant='light' color='warning'>
            System
          </Badge>
        ) : (
          <Badge variant='light' color='primary'>
            Custom
          </Badge>
        ),
      },
      {
        type: TableCellTypes.StatusCell,
        status: role.active ? 'Online' : 'Offline',
        color: role.active ? 'success' : 'dark',
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

export default RoleList;
