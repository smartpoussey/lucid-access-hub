import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DashboardPage } from '@/types/dashboard';

interface DashboardHeaderProps {
  currentPage: DashboardPage;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DashboardHeader({ currentPage, searchQuery, onSearchChange }: DashboardHeaderProps) {
  const { t } = useLanguage();

  const pageTitles: Record<DashboardPage, { title: string; subtitle: string }> = {
    dashboard: { title: t('projDash.dashboardTitle'), subtitle: t('projDash.dashboardSubtitle') },
    appointments: { title: t('projDash.appointmentsTitle'), subtitle: t('projDash.appointmentsSubtitle') },
    patients: { title: t('projDash.patientsTitle'), subtitle: t('projDash.patientsSubtitle') },
    reports: { title: t('projDash.reportsTitle'), subtitle: t('projDash.reportsSubtitle') },
    feedback: { title: t('projDash.feedbackTitle'), subtitle: t('projDash.feedbackSubtitle') },
    settings: { title: t('projDash.settingsTitle'), subtitle: t('projDash.settingsSubtitle') },
  };

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
            placeholder={t('projDash.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64 h-9"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
        </Button>
      </div>
    </header>
  );
}
