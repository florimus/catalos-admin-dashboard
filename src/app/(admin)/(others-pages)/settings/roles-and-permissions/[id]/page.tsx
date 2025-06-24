'use server';

import { getRoleByUniqueId } from '@/actions/role';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RoleForm from '@/components/settings/roles-permission/RoleForm';
import Badge from '@/components/ui/badge/Badge';
// import UserForm from '@/components/users/UserForm';
import { IResponse, IRole } from '@/core/types';

export default async function EditCustomer(ctx: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParam = await ctx.params;

  const roleResponse: IResponse<IRole> = await getRoleByUniqueId(
    awaitedParam.id
  );

  if (!roleResponse.success || !roleResponse.data) {
    return <div>Error fetching role details.</div>;
  }

  const role = roleResponse.data;

  const breadCrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'Roles And Permissions', href: '/settings/roles-and-permissions' },
    { label: role.name, href: '#' },
  ];

  const RoleTitle = (
    <>
      {role.name}{' '}
      <Badge variant='light' color={role.default ? 'warning' : 'primary'}>
        {role.default ? 'System' : 'Custom'}
      </Badge>
    </>
  );

  return (
    <>
      <PageBreadcrumb pageTitle={RoleTitle} items={breadCrumbItems} />
      <RoleForm role={role} />
    </>
  );
}
