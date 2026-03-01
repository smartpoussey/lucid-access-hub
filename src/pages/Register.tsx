import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Register() {
  const { t } = useLanguage();

  const steps = [
    t('register.step1'),
    t('register.step2'),
    t('register.step3'),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              {t('register.brandHeadline')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {t('register.brandDesc')}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 space-y-4"
          >
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">{i + 1}</span>
                </div>
                <span>{step}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('register.backToHome')}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {t('register.title')}
              </h2>
              <p className="text-muted-foreground mt-2">
                {t('register.subtitle')}
              </p>
            </div>

            <RegisterForm />

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('register.alreadyAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
