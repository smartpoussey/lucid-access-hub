import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  { icon: Shield, title: 'Secure Authentication', description: 'Enterprise-grade Firebase auth with role-based access control.' },
  { icon: Zap, title: 'Multi-Tenant Ready', description: 'Manage multiple client projects from a single platform.' },
  { icon: Users, title: 'Team Management', description: 'Assign staff to projects and track progress effortlessly.' },
  { icon: Bot, title: 'AI Integration', description: 'Built for AI-powered healthcare and clinic solutions.' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-sm">
              <span className="text-lg font-display font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-display font-semibold text-foreground">Lucidence</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button className="bg-primary text-primary-foreground">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20" style={{ background: 'var(--gradient-glow)' }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Centralized <span className="text-gradient">AI Platform</span> for Modern Clinics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lucidence provides secure authentication and multi-project management for AI-powered healthcare solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground glow-sm w-full sm:w-auto">
                  Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-border w-full sm:w-auto">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          © 2024 Lucidence Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
