import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardHome } from './pages/DashboardHome';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PatientsPage } from './pages/PatientsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { ClientProject } from '@/types';
import type { DashboardPage } from '@/types/dashboard';
import {
  projectToFirebaseConfig,
  initializeClientProjectFirebase,
  getClientProjectCollectionDocs,
} from '@/services/clientProject.service';

interface ProjectDashboardProps {
  project: ClientProject;
  onBack: () => void;
}

interface CollectionData {
  name: string;
  documents: { id: string; data: Record<string, unknown> }[];
}

export function ProjectDashboard({ project, onBack }: ProjectDashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data on mount
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const config = projectToFirebaseConfig(project);
      initializeClientProjectFirebase(project.clientProjectId, config);

      // Fetch both collections based on project name
      const projectName = project.projectName || project.appName || 'Project';
      const contactsName = `${projectName}_Contacts`;
      const interactionsName = `${projectName}_Interactions`;

      const [contactsDocs, interactionsDocs] = await Promise.all([
        getClientProjectCollectionDocs(project.clientProjectId, contactsName).catch(() => []),
        getClientProjectCollectionDocs(project.clientProjectId, interactionsName).catch(() => []),
      ]);

      setCollections([
        { name: contactsName, documents: contactsDocs },
        { name: interactionsName, documents: interactionsDocs },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Process data for dashboard
  const dashboardData = useDashboardData(collections);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading project data...</p>
        </motion.div>
      </div>
    );
  }

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardHome
            stats={dashboardData.stats}
            weeklyData={dashboardData.weeklyChartData}
            patientDistribution={dashboardData.patientDistribution}
            urgencyData={dashboardData.urgencyData}
            recentPatients={dashboardData.recentPatients}
          />
        );
      case 'appointments':
        return (
          <AppointmentsPage
            appointments={dashboardData.appointments}
            searchQuery={searchQuery}
          />
        );
      case 'patients':
        return (
          <PatientsPage
            patients={dashboardData.allPatients}
            searchQuery={searchQuery}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            stats={dashboardData.stats}
            weeklyData={dashboardData.weeklyChartData}
            patientDistribution={dashboardData.patientDistribution}
            urgencyData={dashboardData.urgencyData}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onBack={onBack}
        projectName={project.projectName || project.appName || 'Project'}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          currentPage={currentPage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}
