import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { SignupForm } from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';

export default function Signup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in Lucidence. Our team will review your application and contact you within 24-48 hours.
          </p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground">
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'var(--gradient-glow)' }}
        />
        
        <div className="relative z-10 flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow">
                <span className="text-2xl font-display font-bold text-primary-foreground">L</span>
              </div>
              <span className="text-2xl font-display font-semibold text-foreground">Lucidence</span>
            </Link>
            
            <h1 className="text-3xl font-display font-bold text-foreground mb-6">
              Join the future of<br />
              <span className="text-gradient">AI-powered clinics</span>
            </h1>
            <p className="text-muted-foreground max-w-sm">
              Apply to become a Lucidence partner and transform your practice with cutting-edge AI solutions.
            </p>

            <div className="mt-12 space-y-4">
              {[
                'Centralized authentication',
                'Multi-project management',
                'AI-powered dashboards',
                'Dedicated support team',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
              Create your application
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and our team will get in touch.
            </p>
          </div>

          <SignupForm onSuccess={() => setIsSubmitted(true)} />

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
