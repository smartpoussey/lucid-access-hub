import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, FolderKanban, Activity,
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAllLeads, getAllUsers, getAllClientProjects, getLeadsByStatus } from '@/services/firestore.service';
import type { Lead, User } from '@/types';

interface DashboardStats {
  totalLeads: number;
  pendingLeads: number;
  activeUsers: number;
  activeProjects: number;
  leadsThisMonth: number;
  usersThisMonth: number;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0, pendingLeads: 0, activeUsers: 0,
    activeProjects: 0, leadsThisMonth: 0, usersThisMonth: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [leads, users, projects, pendingLeads] = await Promise.all([
        getAllLeads(), getAllUsers(), getAllClientProjects(), getLeadsByStatus('pending'),
      ]);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const leadsThisMonth = leads.filter(l => l.createdAt instanceof Date && l.createdAt >= startOfMonth).length;
      const usersThisMonth = users.filter(u => u.createdAt instanceof Date && u.createdAt >= startOfMonth).length;
      const activeUsers = users.filter(u => u.status === 'active').length;
      setStats({ totalLeads: leads.length, pendingLeads: pendingLeads.length, activeUsers, activeProjects: projects.length, leadsThisMonth, usersThisMonth });
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: t('admin.totalLeads'), value: stats.totalLeads.toString(), change: t('admin.thisMonth').replace('{count}', String(stats.leadsThisMonth)), trend: 'up', icon: UserPlus, description: t('admin.allTime') },
    { title: t('admin.activeUsers'), value: stats.activeUsers.toString(), change: t('admin.thisMonth').replace('{count}', String(stats.usersThisMonth)), trend: 'up', icon: Users, description: t('admin.currentlyActive') },
    { title: t('admin.activeProjects'), value: stats.activeProjects.toString(), change: t('admin.allProjects'), trend: 'up', icon: FolderKanban, description: t('admin.clientProjects') },
    { title: t('admin.pendingLeads'), value: stats.pendingLeads.toString(), change: t('admin.awaitingReview'), trend: stats.pendingLeads > 0 ? 'up' : 'down', icon: Activity, description: t('admin.needAttention') },
  ];

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'N/A';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return t('admin.justNow');
    if (hours < 24) return t('admin.hoursAgo').replace('{count}', String(hours));
    if (days === 1) return t('admin.dayAgo');
    return t('admin.daysAgo').replace('{count}', String(days));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-warning/20 text-warning">{t('leads.pending').toLowerCase()}</Badge>;
      case 'contacted': return <Badge className="bg-accent/20 text-accent">{t('leads.contacted').toLowerCase()}</Badge>;
      case 'approved': return <Badge className="bg-success/20 text-success">{t('leads.approved').toLowerCase()}</Badge>;
      case 'rejected': return <Badge className="bg-destructive/20 text-destructive">{t('leads.rejected').toLowerCase()}</Badge>;
      default: return <Badge variant="secondary">{status || t('leads.pending').toLowerCase()}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-foreground">
            {t('admin.dashboard.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-2">
            {t('admin.dashboard.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.description}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('admin.recentLeads')}</CardTitle>
                <CardDescription>{t('admin.latestApplications')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">{t('admin.noLeads')}</p>
                  ) : (
                    recentLeads.map((lead) => (
                      <div key={lead.leadId} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(lead.status)}
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(lead.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('admin.quickActions')}</CardTitle>
                <CardDescription>{t('admin.commonTasks')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('admin.reviewLeads'), icon: UserPlus, href: '/admin/leads', count: stats.pendingLeads },
                    { label: t('admin.manageUsers'), icon: Users, href: '/admin/users', count: stats.activeUsers },
                    { label: t('admin.viewProjects'), icon: FolderKanban, href: '/admin/projects', count: stats.activeProjects },
                    { label: t('admin.manageClients'), icon: Users, href: '/admin/users?role=client' },
                  ].map((action) => (
                    <a key={action.label} href={action.href} className="flex flex-col items-center justify-center p-6 rounded-lg bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 transition-all relative">
                      <action.icon className="h-8 w-8 text-primary mb-3" />
                      <span className="text-sm font-medium text-foreground">{action.label}</span>
                      {action.count !== undefined && action.count > 0 && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{action.count}</Badge>
                      )}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
