'use server';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import SettingsBlock from '@/components/settings/SettingsBlock';
import { LockIcon } from '@/icons';

const SettingsPage = async () => {
  const settingsMenu = [
    {
      title: 'Security Settings',
      blocks: [
        {
          icon: <LockIcon className='text-gray-600 dark:text-gray-300 mb-2' />,
          title: 'Roles And Permissions',
          description: 'Manage roles and permissions of staffs',
          link: '/settings/roles-and-permissions',
        },
      ],
    },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle='Settings'
        items={[{ label: 'settings', href: '#' }]}
      />
      {settingsMenu.map((menu, index) => (
        <ComponentCard key={index} title={menu.title}>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
            {menu.blocks.map((block, index) => (
              <SettingsBlock key={index} {...block} />
            ))}
          </div>
        </ComponentCard>
      ))}
    </>
  );
};

export default SettingsPage;
