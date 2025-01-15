import SideNav from '@/app/ui/dashboard/sidenav';

// turns on partial prerendering in this layout through use of Suspense in children components
// export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
        <p>this is visible in all routes nested in /dashboard</p>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}