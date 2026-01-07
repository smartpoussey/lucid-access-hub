import { motion } from 'framer-motion';
import { 
  Users, UserPlus, FolderKanban, Activity,
  TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Leads',
    value: '127',
    change: '+12%',
    trend: 'up',
    icon: UserPlus,
    description: 'This month',
  },
  {
    title: 'Active Users',
    value: '89',
    change: '+8%',
    trend: 'up',
    icon: Users,
    description: 'All time',
  },
  {
    title: 'Active Projects',
    value: '34',
    change: '+5%',
    trend: 'up',
    icon: FolderKanban,
    description: 'Currently running',
  },
  {
    title: 'System Health',
    value: '99.9%',
    change: '-0.1%',
    trend: 'down',
    icon: Activity,
    description: 'Uptime',
  },
];

const recentLeads = [
  { name: 'Dr. Sarah Johnson', clinic: 'Bay Area Medical', date: '2 hours ago', status: 'pending' },
  { name: 'Michael Chen', clinic: 'Pacific Dental', date: '4 hours ago', status: 'pending' },
  { name: 'Emily Roberts', clinic: 'Sunrise Wellness', date: '1 day ago', status: 'approved' },
  { name: 'James Wilson', clinic: 'Metro Health', date: '2 days ago', status: 'approved' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-foreground"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2"
          >
            Welcome back. Here's an overview of your platform.
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`flex items-center text-sm font-medium ${
                        stat.trend === 'up' ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Leads</CardTitle>
                <CardDescription>Latest applications awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.clinic}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            lead.status === 'pending'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-success/20 text-success'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Review Leads', icon: UserPlus, href: '/admin/leads' },
                    { label: 'Manage Users', icon: Users, href: '/admin/users' },
                    { label: 'View Projects', icon: FolderKanban, href: '/admin/projects' },
                    { label: 'Analytics', icon: TrendingUp, href: '/admin/analytics' },
                  ].map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center justify-center p-6 rounded-lg bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 transition-all"
                    >
                      <action.icon className="h-8 w-8 text-primary mb-3" />
                      <span className="text-sm font-medium text-foreground">{action.label}</span>
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
