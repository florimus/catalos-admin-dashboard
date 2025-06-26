'use server';

import { getRoles } from '@/actions/role';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import RoleList from '@/components/settings/roles-permission/RolesList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IPage, IResponse, IRole, ISearchParams } from '@/core/types';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Roles and Permissions | Catalos Admin',
  };
}

export default async function RolesListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('ROL:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IRole>> = await getRoles(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch staffs:', response.message);
    return <div>Error fetching roles: {response.message}</div>;
  }

  const cta = {
    permission: 'ROL:NN',
    label: 'New Role',
    href: '/settings/roles-and-permissions/create',
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='Roles And Permissions'
        items={[
          { label: 'Settings', href: '/settings' },
          { label: 'Roles And Permissions', href: '#' },
        ]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search Roles...'}
          searchParams={searchParams}
          cta={cta}
        >
          <RoleList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
