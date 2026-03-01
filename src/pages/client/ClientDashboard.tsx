import { motion } from 'framer-motion';
import {
  FolderKanban, ArrowRight, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectDashboard } from '@/components/dashboard/ProjectDashboard';
import { useClientProjects } from '@/hooks/useClientProjects';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClientDashboard() {
  const { t } = useLanguage();
  const {
    projects, selectedProject, isLoadingProjects, error,
    fetchProjects, selectProject, deselectProject,
  } = useClientProjects();

  if (selectedProject) {
    return <ProjectDashboard project={selectedProject} onBack={deselectProject} />;
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">{t('client.myProjects')}</CardTitle>
            <CardDescription className="text-muted-foreground">{t('client.selectProject')}</CardDescription>
          </div>
          <Button onClick={fetchProjects} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('client.refresh')}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingProjects ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground">{t('client.loading')}</span>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.length === 0 ? (
              <Card className="col-span-full card-elevated">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">{t('client.noProjects')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('client.projectsAppear')}</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project, index) => (
                <motion.div key={project.clientProjectId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="card-elevated hover:shadow-lg transition-all cursor-pointer group" onClick={() => selectProject(project)}>
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {project.projectName || project.appName || 'Unnamed Project'}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        ID: {project.projectId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {t('client.openDashboard')}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
