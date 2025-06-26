'use server';

import { getRoleByUniqueId } from '@/actions/role';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RoleForm from '@/components/settings/roles-permission/RoleForm';
import Badge from '@/components/ui/badge/Badge';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IResponse, IRole } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Roles and permission | Catalos Admin',
  };
}

export default async function EditRolePage(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('ROL:LS');
  const awaitedParam = await ctx.params;

  const roleResponse: IResponse<IRole> = await getRoleByUniqueId(
    awaitedParam.id
  );

  if (!roleResponse.success || !roleResponse.data) {
    console.error(roleResponse.message);
    redirect('/404');
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
      <PageBreadcrumb
        pageTitle={RoleTitle}
        items={breadCrumbItems}
        backUrl='/settings/roles-and-permissions'
      />
      <RoleForm role={role} />
    </>
  );
}
