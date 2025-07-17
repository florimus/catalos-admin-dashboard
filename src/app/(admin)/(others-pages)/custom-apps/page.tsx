'use server';

import { getCustomApps } from '@/actions/customApp';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomAppList from '@/components/customApps/CustomAppList';
import InstalledAppList from '@/components/customApps/InstalledAppList';
import SecureComponent from '@/core/authentication/SecureComponent';
import { ICustomApp, IPage, IResponse } from '@/core/types';
import InstallCustomAppModal from './InstallCustomAppModal';

const allCustomApps: ICustomApp[] = [
  {
    id: 'eb78fa27-6c6e-4377-956a-d400db2be64b',
    name: 'Razor Pay',
    logo: 'https://media.tradly.app/images/marketplace/34521/razor_pay_icon-ICtywSbN.png',
    description:
      'Razorpay is a leading Indian payment gateway platform that allows businesses to accept, process, and disburse payments easily. This custom app is for enable seamless integration with Razor Pay',
    appType: 'PaymentOption',
    connectionUrl: 'http://localhost:4000',
    applicableChannels: [],
    active: true,
    githubUrl: 'https://github.com/Anoopoo7/catalos-razorpay-app.git',
  },
];

const CustomAppListingPage = async () => {
  const installedAppsResponse: IResponse<IPage<ICustomApp>> =
    await getCustomApps();

  const installedApps = Array.isArray(installedAppsResponse?.data?.hits)
    ? installedAppsResponse?.data?.hits
    : [];

  return (
    <>
      <PageBreadcrumb
        pageTitle='Custom Apps'
        items={[{ label: 'Custom apps', href: '#' }]}
      />
      <SecureComponent permission='APP:LS'>
        <ComponentCard title='Installed Apps' cts={<InstallCustomAppModal />}>
          <InstalledAppList installedApps={installedApps} />
        </ComponentCard>
      </SecureComponent>
      <ComponentCard title='All Apps'>
        <CustomAppList installedApps={allCustomApps} />
      </ComponentCard>
    </>
  );
};

export default CustomAppListingPage;
