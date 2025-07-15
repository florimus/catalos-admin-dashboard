'use client';

import { IAPIKey } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { TrashBinIcon } from '@/icons';

interface ApiKeyListProps {
  hits?: IAPIKey[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ApiKeyKList: React.FC<ApiKeyListProps> = ({ hits = [], ...rest }) => {
  const headingData: string[] = ['Name', 'Key ID', 'Role', 'Status', 'Revoke'];

  const tableData =
    hits?.map((apiKey) => [
      {
        type: TableCellTypes.TextCell,
        text: apiKey.name,
      },
      {
        type: TableCellTypes.TextCell,
        text: '...' + apiKey.apiKey.slice(-5),
      },
      {
        type: TableCellTypes.TextCell,
        text: apiKey.roleId,
      },
      {
        type: TableCellTypes.StatusCell,
        status: apiKey.active ? 'Online' : 'Offline',
        color: apiKey.active ? 'success' : 'dark',
      },
      {
        type: TableCellTypes.TextCell,
        text: <TrashBinIcon />,
        onclick: () => alert('Revoke API Key: ' + apiKey.name),
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

export default ApiKeyKList;
