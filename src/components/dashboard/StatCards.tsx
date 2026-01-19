import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/types/dashboard';

interface StatCardsProps {
  stats: DashboardStats;
}

const statConfig = [
  {
    key: 'totalPatients' as const,
    label: 'Total Patients',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'newPatientsToday' as const,
    label: 'New Today',
    icon: UserPlus,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    key: 'existingPatients' as const,
    label: 'Existing Patients',
    icon: UserCheck,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    key: 'appointmentsToday' as const,
    label: 'Appointments Today',
    icon: Calendar,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((stat, index) => {
        const Icon = stat.icon;
        const value = stats[stat.key];

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-elevated hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
