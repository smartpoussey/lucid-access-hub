import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Login() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'var(--gradient-glow)' }}
        />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
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
            
            <h1 className="text-4xl font-display font-bold text-foreground mb-6">
              {t('login.brandHeadline')}<br />
              <span className="text-gradient">{t('login.brandHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {t('login.brandDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors lg:hidden"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('login.backToHome')}
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
              {t('login.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('login.subtitle')}
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 space-y-4 text-center">
            <p className="text-muted-foreground">
              {t('login.noAccount')}{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t('login.applyLead')}
              </Link>
            </p>
            <p className="text-muted-foreground">
              {t('login.needRegister')}{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t('login.createAccount')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
