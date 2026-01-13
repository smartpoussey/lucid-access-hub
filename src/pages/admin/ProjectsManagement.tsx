import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Settings, ExternalLink, 
  Loader2, Users, Activity
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllClientProjects } from '@/services/firestore.service';
import type { ClientProject } from '@/types';

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data
  const demoProjects: ClientProject[] = [
    {
      clientProjectId: '1',
      clientId: 'client1',
      appName: 'Bay Area Medical',
      appEnv: 'production',
      projectName: 'Bay Area Medical - AI Assistant',
      apiKey: 'demo-key',
      authDomain: 'project.firebaseapp.com',
      projectId: 'bay-area-medical-ai',
      storageBucket: 'project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123:web:abc',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      clientProjectId: '2',
      clientId: 'client2',
      appName: 'Pacific Dental',
      appEnv: 'production',
      projectName: 'Pacific Dental - Chatbot',
      apiKey: 'demo-key-2',
      authDomain: 'project2.firebaseapp.com',
      projectId: 'pacific-dental-chat',
      storageBucket: 'project2.appspot.com',
      messagingSenderId: '987654321',
      appId: '1:987:web:xyz',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      clientProjectId: '3',
      clientId: 'client3',
      appName: 'Sunrise Wellness',
      appEnv: 'staging',
      projectName: 'Sunrise Wellness - Portal',
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getAllClientProjects();
      setProjects(data.length > 0 ? data : demoProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects(demoProjects);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectStatus = (project: ClientProject) => {
    if (!project.apiKey || !project.projectId) {
      return 'setup';
    }
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'setup':
        return 'bg-warning/20 text-warning';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-display font-bold text-foreground"
            >
              Client Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2"
            >
              Manage and configure client AI projects.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No projects found.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const status = getProjectStatus(project);
              return (
                <Card 
                  key={project.clientProjectId} 
                  className="bg-card border-border hover:border-primary/30 transition-all group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                          {project.projectName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          Project ID: {project.projectId || 'Not configured'}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          <span>{status === 'active' ? 'Active' : 'Setup Required'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>2 staff</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-border">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-border">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
