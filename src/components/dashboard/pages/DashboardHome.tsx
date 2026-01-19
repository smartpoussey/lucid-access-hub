import { StatCards } from '../StatCards';
import { DashboardCharts } from '../DashboardCharts';
import { RecentPatientsList } from '../RecentPatientsList';
import type { DashboardStats, ChartDataPoint, PieChartDataPoint, PatientRow } from '@/types/dashboard';

interface DashboardHomeProps {
  stats: DashboardStats;
  weeklyData: ChartDataPoint[];
  patientDistribution: PieChartDataPoint[];
  urgencyData: { name: string; count: number; fill: string }[];
  recentPatients: PatientRow[];
}

export function DashboardHome({
  stats,
  weeklyData,
  patientDistribution,
  urgencyData,
  recentPatients,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <StatCards stats={stats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardCharts
            weeklyData={weeklyData}
            patientDistribution={patientDistribution}
            urgencyData={urgencyData}
          />
        </div>
        <div className="xl:col-span-1">
          <RecentPatientsList patients={recentPatients} />
        </div>
      </div>
    </div>
  );
}
