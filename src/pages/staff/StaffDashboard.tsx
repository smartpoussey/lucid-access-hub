import { motion } from 'framer-motion';
import { FolderKanban, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StaffDashboard() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-foreground">
            {t('staff.dashboard.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-2">
            {t('staff.dashboard.subtitle')}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5 text-primary" />{t('staff.assignedProjects')}</CardTitle>
              <CardDescription>{t('staff.assignedDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('staff.noProjects')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
