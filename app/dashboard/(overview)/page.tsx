import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// fetchRevenue is a function located in the server component data.ts it queries our supabase databse directly
import { fetchRevenue,fetchLatestInvoices,fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton,LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { CardSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
    // const revenue = await fetchRevenue();
    // const latestInvoices = await fetchLatestInvoices();
    // const {totalPaidInvoices,totalPendingInvoices,numberOfInvoices,numberOfCustomers} = await fetchCardData();
    // revenue data is now fetched in RevenueChart component
    // const revenue = await fetchRevenue();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/*<Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
        */}
      {/* Instead of rendering each card one by one which can cause a popping pattern in rendering, we implement a technique that GROUPS the components
      into a wrapper, once all components data are fetched and ready, the wrapper container renders itself as one big component */}
      <Suspense fallback={<CardSkeleton/>}>
          <CardWrapper/>
      </Suspense>
    </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton/>}>
          {/* <RevenueChart revenue={revenue}  /> */}
          {/* revenye no longer accepts a data prop as it fetches its data within itself */}
          <RevenueChart/>

        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton/>}>
            <LatestInvoices/>
        </Suspense>
      </div>
    </main>
  );
}