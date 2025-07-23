import { DashboardNavbar } from '@/components/layout/dashboard-navbar';

/**
 * Props for the DashboardLayout component
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard layout component
 * Provides consistent layout structure for all dashboard pages
 * Includes navigation header and main content area
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
} 