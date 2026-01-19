import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DashboardPage } from '@/types/dashboard';

interface DashboardHeaderProps {
  currentPage: DashboardPage;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const pageTitles: Record<DashboardPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s an overview of your practice.' },
  appointments: { title: 'Appointments', subtitle: 'Manage patient bookings and schedules.' },
  patients: { title: 'Patients', subtitle: 'View and manage your patient records.' },
  reports: { title: 'Reports', subtitle: 'Analytics and insights for your practice.' },
  settings: { title: 'Settings', subtitle: 'Configure your preferences and account.' },
};

export function DashboardHeader({
  currentPage,
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  const { title, subtitle } = pageTitles[currentPage];

  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64 h-9"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
