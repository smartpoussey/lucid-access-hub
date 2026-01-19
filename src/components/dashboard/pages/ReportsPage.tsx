import { StatCards } from '../StatCards';
import { DashboardCharts } from '../DashboardCharts';
import type { DashboardStats, ChartDataPoint, PieChartDataPoint } from '@/types/dashboard';

interface ReportsPageProps {
  stats: DashboardStats;
  weeklyData: ChartDataPoint[];
  patientDistribution: PieChartDataPoint[];
  urgencyData: { name: string; count: number; fill: string }[];
}

export function ReportsPage({
  stats,
  weeklyData,
  patientDistribution,
  urgencyData,
}: ReportsPageProps) {
  return (
    <div className="space-y-6">
      <StatCards stats={stats} />
      <DashboardCharts
        weeklyData={weeklyData}
        patientDistribution={patientDistribution}
        urgencyData={urgencyData}
      />
    </div>
  );
}
