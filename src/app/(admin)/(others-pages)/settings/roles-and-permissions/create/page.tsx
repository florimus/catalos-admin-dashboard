'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RoleForm from '@/components/settings/roles-permission/RoleForm';
import { validatePermissions } from '@/core/authentication/roleValidations';

export default async function CreateRolePage() {
  await validatePermissions('ROL:NN');
  const breadCrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'Roles And Permissions', href: '/settings/roles-and-permissions' },
    { label: 'Create Role', href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle='Create Role' items={breadCrumbItems} />
      <RoleForm />
    </>
  );
}
