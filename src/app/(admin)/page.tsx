'use server';

import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import React from 'react';
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget';
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart';
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from '@/components/ecommerce/RecentOrders';
import DemographicCard from '@/components/ecommerce/DemographicCard';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { getDashboardData } from '@/actions/dashboard';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Catalos Admin',
    description: 'Admin dashboard for managing ecommerce metrics and data.',
  };
}

export default async function Ecommerce() {
  if(!await validatePermissions('DAS:LS', true)){
    redirect('/profile');
  }

  const dashboardInfoResponse = await getDashboardData();
  if (!dashboardInfoResponse.success || !dashboardInfoResponse.data) {
    return <></>
  }

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 space-y-6 xl:col-span-7'>
        <EcommerceMetrics {...dashboardInfoResponse.data} />

        <MonthlySalesChart {...dashboardInfoResponse.data} />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <MonthlyTarget {...dashboardInfoResponse.data} />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      <div className='col-span-12 xl:col-span-5'>
        <DemographicCard {...dashboardInfoResponse.data} />
      </div>

      <div className='col-span-12 xl:col-span-7'>
        <RecentOrders />
      </div>
    </div>
  );
}
