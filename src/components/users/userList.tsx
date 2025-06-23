'use client';

import { IUserInfo } from '@/core/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface UserListProps {
  origin: string;
  hits?: IUserInfo[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const UserList: FC<UserListProps> = ({ origin, hits = [], ...rest }) => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const headingData: string[] = ['Profile', 'Email', 'Status', 'Role'];

  const goToVariantDetails = (variantId: string) =>
    start(() => router.push(`${origin}/${variantId}`));

  const tableData =
    hits?.map((user) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: true,
        primaryText: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
        src: user.avatar,
        secondaryText: user.id,
        onclick: () => goToVariantDetails(user.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: user.email,
      },
      {
        type: TableCellTypes.StatusCell,
        status: user.active ? 'Live' : 'Off',
        color: user.active ? 'success' : 'dark',
      },
      {
        type: TableCellTypes.TextCell,
        text: user.roleId,
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

export default UserList;
