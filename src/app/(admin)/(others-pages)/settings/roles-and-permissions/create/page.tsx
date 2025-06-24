'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RoleForm from '@/components/settings/roles-permission/RoleForm';

export default async function CreateRolePage() {
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
