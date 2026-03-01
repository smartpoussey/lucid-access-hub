import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, BarChart3, MessageSquare,
  Settings, LogOut, ChevronLeft, Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DashboardPage } from '@/types/dashboard';

interface DashboardSidebarProps {
  currentPage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  onBack: () => void;
  projectName: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardSidebar({
  currentPage, onNavigate, onBack, projectName, collapsed = false, onToggleCollapse,
}: DashboardSidebarProps) {
  const { t } = useLanguage();

  const navItems: { id: DashboardPage; labelKey: string; icon: React.ElementType }[] = [
    { id: 'dashboard', labelKey: 'projDash.dashboard', icon: LayoutDashboard },
    { id: 'appointments', labelKey: 'projDash.appointments', icon: Calendar },
    { id: 'patients', labelKey: 'projDash.patients', icon: Users },
    { id: 'reports', labelKey: 'projDash.reports', icon: BarChart3 },
    { id: 'feedback', labelKey: 'projDash.feedback', icon: MessageSquare },
    { id: 'settings', labelKey: 'projDash.settings', icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Stethoscope className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm text-sidebar-foreground truncate">{projectName}</h2>
            <p className="text-xs text-muted-foreground">{t('projDash.doctorPanel')}</p>
          </div>
        )}
        {onToggleCollapse && (
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={onToggleCollapse}>
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button
          onClick={onBack}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>{t('projDash.exitProject')}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
