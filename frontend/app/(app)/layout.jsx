import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen md:flex">
      <SidebarNav />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
