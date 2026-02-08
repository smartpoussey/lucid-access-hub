import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.testimonials': 'Testimonials',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    
    // Hero
    'hero.badge': 'AI-Powered Healthcare Solutions',
    'hero.title': 'Intelligent Automation for',
    'hero.titleHighlight': 'Modern Clinics',
    'hero.description': 'Lucidence provides AI-powered reception, scheduling, and patient management. Reduce no-shows, automate calls, and focus on what matters most—your patients.',
    'hero.cta': 'Start Free Trial',
    'hero.learnMore': 'Learn More',
    'hero.noCard': 'No credit card required',
    'hero.trial': '14-day free trial',
    'hero.hipaa': 'HIPAA compliant',
    
    // Features
    'features.title': 'Everything you need to modernize your practice',
    'features.description': 'From AI-powered reception to intelligent scheduling, Lucidence provides the tools your clinic needs to thrive.',
    'features.secureAuth': 'Secure Authentication',
    'features.secureAuthDesc': 'Enterprise-grade security with role-based access control and multi-factor authentication.',
    'features.multiTenant': 'Multi-Tenant Ready',
    'features.multiTenantDesc': 'Manage multiple client projects from a single platform with isolated data environments.',
    'features.teamMgmt': 'Team Management',
    'features.teamMgmtDesc': 'Assign staff to projects, track progress, and collaborate effortlessly.',
    'features.aiIntegration': 'AI Integration',
    'features.aiIntegrationDesc': 'Built-in AI capabilities for healthcare automation and intelligent workflows.',
    'features.scheduling': 'Smart Scheduling',
    'features.schedulingDesc': 'Automated appointment management with intelligent conflict resolution.',
    'features.cloud': 'Cloud Native',
    'features.cloudDesc': 'Scalable infrastructure that grows with your practice needs.',
    
    // Testimonials
    'testimonials.title': 'Trusted by healthcare professionals',
    'testimonials.description': 'See what our customers have to say about transforming their practices with Lucidence.',
    
    // Pricing
    'pricing.title': 'Simple, transparent pricing',
    'pricing.description': 'Choose the plan that fits your practice. All plans include a 14-day free trial.',
    'pricing.starter': 'Starter',
    'pricing.starterDesc': 'Perfect for small practices getting started with AI',
    'pricing.professional': 'Professional',
    'pricing.professionalDesc': 'For growing practices that need more power',
    'pricing.enterprise': 'Enterprise',
    'pricing.enterpriseDesc': 'For large organizations with custom needs',
    'pricing.mostPopular': 'Most Popular',
    'pricing.startTrial': 'Start Free Trial',
    'pricing.contactSales': 'Contact Sales',
    'pricing.month': '/month',
    'pricing.calls500': 'Up to 500 calls/month',
    'pricing.calls2000': 'Up to 2,000 calls/month',
    'pricing.unlimitedCalls': 'Unlimited calls',
    'pricing.basicAI': 'Basic AI receptionist',
    'pricing.advancedAI': 'Advanced AI receptionist',
    'pricing.fullAI': 'Full AI suite',
    'pricing.emailSupport': 'Email support',
    'pricing.prioritySupport': 'Priority support',
    'pricing.dedicatedSupport': 'Dedicated support',
    'pricing.standardAnalytics': 'Standard analytics',
    'pricing.advancedAnalytics': 'Advanced analytics',
    'pricing.customAnalytics': 'Custom analytics',
    'pricing.1user': '1 user included',
    'pricing.5users': '5 users included',
    'pricing.unlimitedUsers': 'Unlimited users',
    'pricing.customIntegrations': 'Custom integrations',
    'pricing.whiteLabel': 'White-label options',
    'pricing.sla': 'SLA guarantee',
    
    // FAQ
    'faq.title': 'Frequently asked questions',
    'faq.description': 'Have questions? We have answers. If you can\'t find what you\'re looking for, reach out to our team.',
    'faq.q1': 'How does the AI receptionist work?',
    'faq.a1': 'Our AI receptionist uses advanced natural language processing to understand and respond to patient calls. It can schedule appointments, answer common questions, and seamlessly transfer complex inquiries to your staff.',
    'faq.q2': 'Is my patient data secure?',
    'faq.a2': 'Absolutely. We are HIPAA compliant and use enterprise-grade encryption for all data at rest and in transit. Your patient information is protected with the highest security standards.',
    'faq.q3': 'Can I integrate with my existing systems?',
    'faq.a3': 'Yes! Lucidence integrates with most popular EHR/EMR systems, practice management software, and calendar applications. Our team will help you set up custom integrations if needed.',
    'faq.q4': 'How long does setup take?',
    'faq.a4': 'Most practices are up and running within 24-48 hours. Our onboarding team will guide you through the process and ensure everything is configured to your needs.',
    'faq.q5': 'What happens if the AI cannot handle a call?',
    'faq.a5': 'Our AI knows its limitations. When it encounters a complex situation, it will smoothly transfer the call to your staff or take a message for callback, ensuring no patient is left without assistance.',
    
    // CTA
    'cta.title': 'Ready to transform your practice?',
    'cta.description': 'Join hundreds of healthcare providers who have modernized their operations with Lucidence.',
    'cta.trial': 'Start Your Free Trial',
    'cta.signIn': 'Sign In',
    
    // Footer
    'footer.tagline': 'AI-powered solutions for modern healthcare practices.',
    'footer.product': 'Product',
    'footer.integrations': 'Integrations',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.copyright': '© {year} Lucidence Platform. All rights reserved.',
  },
  de: {
    // Navbar
    'nav.features': 'Funktionen',
    'nav.testimonials': 'Referenzen',
    'nav.pricing': 'Preise',
    'nav.faq': 'FAQ',
    'nav.login': 'Anmelden',
    'nav.getStarted': 'Loslegen',
    
    // Hero
    'hero.badge': 'KI-gestützte Gesundheitslösungen',
    'hero.title': 'Intelligente Automatisierung für',
    'hero.titleHighlight': 'Moderne Kliniken',
    'hero.description': 'Lucidence bietet KI-gestützte Rezeption, Terminplanung und Patientenverwaltung. Reduzieren Sie Terminausfälle, automatisieren Sie Anrufe und konzentrieren Sie sich auf das Wichtigste – Ihre Patienten.',
    'hero.cta': 'Kostenlos testen',
    'hero.learnMore': 'Mehr erfahren',
    'hero.noCard': 'Keine Kreditkarte erforderlich',
    'hero.trial': '14 Tage kostenlos',
    'hero.hipaa': 'HIPAA-konform',
    
    // Features
    'features.title': 'Alles, was Sie zur Modernisierung Ihrer Praxis brauchen',
    'features.description': 'Von KI-gestützter Rezeption bis zur intelligenten Terminplanung – Lucidence bietet die Werkzeuge, die Ihre Klinik zum Erfolg führen.',
    'features.secureAuth': 'Sichere Authentifizierung',
    'features.secureAuthDesc': 'Unternehmensweite Sicherheit mit rollenbasierter Zugriffskontrolle und Multi-Faktor-Authentifizierung.',
    'features.multiTenant': 'Multi-Mandanten-fähig',
    'features.multiTenantDesc': 'Verwalten Sie mehrere Kundenprojekte von einer einzigen Plattform mit isolierten Datenumgebungen.',
    'features.teamMgmt': 'Teamverwaltung',
    'features.teamMgmtDesc': 'Weisen Sie Mitarbeiter Projekten zu, verfolgen Sie Fortschritte und arbeiten Sie mühelos zusammen.',
    'features.aiIntegration': 'KI-Integration',
    'features.aiIntegrationDesc': 'Integrierte KI-Funktionen für Gesundheitsautomatisierung und intelligente Arbeitsabläufe.',
    'features.scheduling': 'Intelligente Terminplanung',
    'features.schedulingDesc': 'Automatisierte Terminverwaltung mit intelligenter Konfliktlösung.',
    'features.cloud': 'Cloud-nativ',
    'features.cloudDesc': 'Skalierbare Infrastruktur, die mit den Anforderungen Ihrer Praxis wächst.',
    
    // Testimonials
    'testimonials.title': 'Vertraut von Gesundheitsexperten',
    'testimonials.description': 'Erfahren Sie, was unsere Kunden über die Transformation ihrer Praxen mit Lucidence sagen.',
    
    // Pricing
    'pricing.title': 'Einfache, transparente Preise',
    'pricing.description': 'Wählen Sie den Plan, der zu Ihrer Praxis passt. Alle Pläne beinhalten eine 14-tägige kostenlose Testversion.',
    'pricing.starter': 'Starter',
    'pricing.starterDesc': 'Perfekt für kleine Praxen, die mit KI beginnen',
    'pricing.professional': 'Professional',
    'pricing.professionalDesc': 'Für wachsende Praxen, die mehr Leistung benötigen',
    'pricing.enterprise': 'Enterprise',
    'pricing.enterpriseDesc': 'Für große Organisationen mit individuellen Anforderungen',
    'pricing.mostPopular': 'Am beliebtesten',
    'pricing.startTrial': 'Kostenlos testen',
    'pricing.contactSales': 'Vertrieb kontaktieren',
    'pricing.month': '/Monat',
    'pricing.calls500': 'Bis zu 500 Anrufe/Monat',
    'pricing.calls2000': 'Bis zu 2.000 Anrufe/Monat',
    'pricing.unlimitedCalls': 'Unbegrenzte Anrufe',
    'pricing.basicAI': 'Basis-KI-Rezeptionist',
    'pricing.advancedAI': 'Erweiterter KI-Rezeptionist',
    'pricing.fullAI': 'Vollständige KI-Suite',
    'pricing.emailSupport': 'E-Mail-Support',
    'pricing.prioritySupport': 'Prioritäts-Support',
    'pricing.dedicatedSupport': 'Dedizierter Support',
    'pricing.standardAnalytics': 'Standard-Analysen',
    'pricing.advancedAnalytics': 'Erweiterte Analysen',
    'pricing.customAnalytics': 'Individuelle Analysen',
    'pricing.1user': '1 Benutzer inklusive',
    'pricing.5users': '5 Benutzer inklusive',
    'pricing.unlimitedUsers': 'Unbegrenzte Benutzer',
    'pricing.customIntegrations': 'Individuelle Integrationen',
    'pricing.whiteLabel': 'White-Label-Optionen',
    'pricing.sla': 'SLA-Garantie',
    
    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    'faq.description': 'Haben Sie Fragen? Wir haben Antworten. Wenn Sie nicht finden, wonach Sie suchen, kontaktieren Sie unser Team.',
    'faq.q1': 'Wie funktioniert der KI-Rezeptionist?',
    'faq.a1': 'Unser KI-Rezeptionist verwendet fortschrittliche Sprachverarbeitung, um Patientenanrufe zu verstehen und zu beantworten. Er kann Termine planen, häufige Fragen beantworten und komplexe Anfragen nahtlos an Ihr Personal weiterleiten.',
    'faq.q2': 'Sind meine Patientendaten sicher?',
    'faq.a2': 'Absolut. Wir sind HIPAA-konform und verwenden Verschlüsselung auf Unternehmensebene für alle Daten. Ihre Patienteninformationen sind mit den höchsten Sicherheitsstandards geschützt.',
    'faq.q3': 'Kann ich meine bestehenden Systeme integrieren?',
    'faq.a3': 'Ja! Lucidence integriert sich mit den meisten gängigen EHR/EMR-Systemen, Praxisverwaltungssoftware und Kalenderanwendungen. Unser Team hilft Ihnen bei Bedarf bei individuellen Integrationen.',
    'faq.q4': 'Wie lange dauert die Einrichtung?',
    'faq.a4': 'Die meisten Praxen sind innerhalb von 24-48 Stunden einsatzbereit. Unser Onboarding-Team führt Sie durch den Prozess und stellt sicher, dass alles nach Ihren Bedürfnissen konfiguriert ist.',
    'faq.q5': 'Was passiert, wenn die KI einen Anruf nicht bearbeiten kann?',
    'faq.a5': 'Unsere KI kennt ihre Grenzen. Bei komplexen Situationen leitet sie den Anruf nahtlos an Ihr Personal weiter oder nimmt eine Nachricht für einen Rückruf auf.',
    
    // CTA
    'cta.title': 'Bereit, Ihre Praxis zu transformieren?',
    'cta.description': 'Schließen Sie sich Hunderten von Gesundheitsdienstleistern an, die ihre Abläufe mit Lucidence modernisiert haben.',
    'cta.trial': 'Kostenlose Testversion starten',
    'cta.signIn': 'Anmelden',
    
    // Footer
    'footer.tagline': 'KI-gestützte Lösungen für moderne Gesundheitspraxen.',
    'footer.product': 'Produkt',
    'footer.integrations': 'Integrationen',
    'footer.company': 'Unternehmen',
    'footer.about': 'Über uns',
    'footer.blog': 'Blog',
    'footer.careers': 'Karriere',
    'footer.legal': 'Rechtliches',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
    'footer.copyright': '© {year} Lucidence Platform. Alle Rechte vorbehalten.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('lucidence-language');
    return (stored as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('lucidence-language', lang);
  };

  const t = (key: string): string => {
    const value = translations[language][key];
    if (!value) return key;
    return value.replace('{year}', new Date().getFullYear().toString());
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
