import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { SignupForm } from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Signup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
            {t('signup.submitted.title')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('signup.submitted.desc')}
          </p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground">
            {t('signup.submitted.cta')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const features = [
    t('signup.feature1'),
    t('signup.feature2'),
    t('signup.feature3'),
    t('signup.feature4'),
  ];

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
              <div className="rounded-l flex items-center justify-center" style={{ height: '55px', overflow: 'hidden' }}>
                <img className='h-auto dark:invert dark:brightness-200'
                  src="./assets/lucidence-logo-DNPRbMjo.png"
                  alt="Lucidence"
                  style={{ width: '180px', height: 'auto', objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </Link>
            
            <h1 className="text-3xl font-display font-bold text-foreground mb-6">
              {t('signup.brandHeadline')}<br />
              <span className="text-gradient">{t('signup.brandHighlight')}</span>
            </h1>
            <p className="text-muted-foreground max-w-sm">
              {t('signup.brandDesc')}
            </p>

            <div className="mt-12 space-y-4">
              {features.map((feature, index) => (
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
            {t('signup.backToHome')}
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
              {t('signup.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('signup.subtitle')}
            </p>
          </div>

          <SignupForm onSuccess={() => setIsSubmitted(true)} />

          <p className="mt-8 text-center text-muted-foreground">
            {t('signup.alreadyAccount')}{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
