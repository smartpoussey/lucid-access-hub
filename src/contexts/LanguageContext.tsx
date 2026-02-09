import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  de: {
    // Navbar
    'nav.howItWorks': 'So funktioniert es',
    'nav.products': 'Produkte',
    'nav.pricing': 'Preise',
    'nav.demo': 'Demo',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.getStarted': 'Jetzt starten',

    // Hero
    'hero.headline': 'Verpassen Sie nie wieder einen Kunden.',
    'hero.subheadline': 'Ihr 24/7 KI-Rezeptionist — KI-gestützt, in Deutschland gehostet.',
    'hero.compliance': '100% DSGVO-konform',
    'hero.bullet1': 'Telefonanrufe',
    'hero.bullet2': 'WhatsApp & Chat',
    'hero.bullet3': 'Auto-Buchung',
    'hero.cta': 'Demo buchen',
    'hero.trust': '🇩🇪 Gehostet in Frankfurt • 🔒 DSGVO-konform',

    // How It Works
    'howItWorks.title': 'So funktioniert es',
    'howItWorks.subtitle': 'In drei einfachen Schritten zu Ihrem KI-Rezeptionisten',
    'howItWorks.step1.title': 'Geschäftstyp auswählen',
    'howItWorks.step1.desc': 'Wählen Sie Ihre Branche und passen Sie den KI-Assistenten an Ihre Bedürfnisse an.',
    'howItWorks.step2.title': 'KI-Rezeptionisten personalisieren',
    'howItWorks.step2.desc': 'Konfigurieren Sie Antworten, Terminregeln und Gesprächsabläufe individuell.',
    'howItWorks.step3.title': 'In Minuten live gehen',
    'howItWorks.step3.desc': 'Aktivieren Sie Ihren KI-Rezeptionisten und beginnen Sie sofort mit der Automatisierung.',

    // Products
    'products.title': 'Unsere Produkte',
    'products.subtitle': 'Maßgeschneiderte KI-Lösungen für Ihr Unternehmen',
    'products.receptionist.category': 'Kernprodukt',
    'products.receptionist.name': 'KI-Rezeptionist',
    'products.receptionist.desc': 'Automatisierte Anrufannahme, Terminbuchung und Kundenbetreuung rund um die Uhr.',
    'products.gdpr.category': 'Compliance',
    'products.gdpr.name': 'DSGVO-Copilot',
    'products.gdpr.desc': 'Automatisierte Datenschutz-Compliance und Dokumentation für Ihr Unternehmen.',
    'products.esg.category': 'Nachhaltigkeit',
    'products.esg.name': 'ESG-Reporter',
    'products.esg.desc': 'Automatisierte ESG-Berichterstattung und Nachhaltigkeitsanalysen.',
    'products.workflow.category': 'Automatisierung',
    'products.workflow.name': 'KI-Workflow-Automatisierung',
    'products.workflow.desc': 'Intelligente Prozessautomatisierung für wiederkehrende Geschäftsabläufe.',
    'products.learnMore': 'Mehr erfahren',

    // Pricing
    'pricing.title': 'Transparente Preise',
    'pricing.subtitle': 'Wählen Sie den Plan, der zu Ihrem Unternehmen passt. Alle Pläne mit kostenloser Testphase.',
    'pricing.starter': 'Starter',
    'pricing.starterDesc': 'Ideal für kleine Unternehmen und Einzelpraxen.',
    'pricing.starterPrice': '99',
    'pricing.pro': 'Pro',
    'pricing.proDesc': 'Für wachsende Unternehmen mit höherem Volumen.',
    'pricing.proPrice': '249',
    'pricing.enterprise': 'Enterprise',
    'pricing.enterpriseDesc': 'Für große Organisationen mit individuellen Anforderungen.',
    'pricing.enterprisePrice': '499',
    'pricing.mostPopular': 'Am beliebtesten',
    'pricing.month': '/Monat',
    'pricing.cta': 'Kostenlos testen',
    'pricing.trialNote': '14 Tage kostenlos testen — keine Kreditkarte erforderlich',
    'pricing.hostingNote': '🇩🇪 Alle Daten auf deutschen Servern gehostet',
    // Starter features
    'pricing.starter.f1': 'Bis zu 100 Anrufe/Monat',
    'pricing.starter.f2': 'KI-Rezeptionist (Basis)',
    'pricing.starter.f3': 'Terminbuchung',
    'pricing.starter.f4': 'E-Mail-Support',
    'pricing.starter.f5': '1 Benutzer',
    // Pro features
    'pricing.pro.f1': 'Bis zu 500 Anrufe/Monat',
    'pricing.pro.f2': 'KI-Rezeptionist (Erweitert)',
    'pricing.pro.f3': 'WhatsApp-Integration',
    'pricing.pro.f4': 'Prioritäts-Support',
    'pricing.pro.f5': '5 Benutzer',
    'pricing.pro.f6': 'Erweiterte Analysen',
    // Enterprise features
    'pricing.enterprise.f1': 'Unbegrenzte Anrufe',
    'pricing.enterprise.f2': 'Vollständige KI-Suite',
    'pricing.enterprise.f3': 'Dedizierter Account Manager',
    'pricing.enterprise.f4': 'Individuelle Integrationen',
    'pricing.enterprise.f5': 'Unbegrenzte Benutzer',
    'pricing.enterprise.f6': 'SLA-Garantie',
    'pricing.enterprise.f7': 'White-Label-Option',

    // Why Lucidence
    'why.title': 'Warum Lucidence AI',
    'why.subtitle': 'Vertrauen Sie auf deutsche Qualität und Innovation',
    'why.gdpr.title': '100% DSGVO-sicher',
    'why.gdpr.desc': 'Vollständige Konformität mit europäischen Datenschutzrichtlinien.',
    'why.bilingual.title': 'Zweisprachiger Support',
    'why.bilingual.desc': 'Nahtlose Kommunikation auf Deutsch und Englisch.',
    'why.eu.title': 'EU-Server-Hosting',
    'why.eu.desc': 'Alle Daten werden ausschließlich auf EU-Servern gespeichert.',
    'why.custom.title': 'Individuell trainierte KI',
    'why.custom.desc': 'Auf Ihr Unternehmen zugeschnittene KI-Modelle.',
    'why.instant.title': 'Sofortige Einrichtung',
    'why.instant.desc': 'In wenigen Minuten einsatzbereit, ohne technisches Wissen.',
    'why.availability.title': '24/7 Verfügbarkeit',
    'why.availability.desc': 'Ihr KI-Rezeptionist arbeitet rund um die Uhr, jeden Tag.',

    // Demo
    'demo.title': 'Live-Demo',
    'demo.subtitle': 'Erleben Sie unseren KI-Rezeptionisten in Aktion',
    'demo.tryLive': 'Live-Demo testen',
    'demo.tryCall': 'Sprachanruf testen',
    'demo.tag1': 'Natürliche Gespräche',
    'demo.tag2': 'Auto-Buchung',
    'demo.tag3': 'Mehrsprachig',
    'demo.user1': 'Hallo, ich möchte gerne einen Termin vereinbaren.',
    'demo.ai1': 'Gerne! Ich kann Ihnen folgende Zeiten anbieten: Montag 14:00, Dienstag 10:00 oder Mittwoch 16:00. Welcher Termin passt Ihnen am besten?',
    'demo.user2': 'Dienstag um 10:00 Uhr wäre perfekt.',
    'demo.ai2': 'Wunderbar! Ihr Termin am Dienstag um 10:00 Uhr ist bestätigt. Sie erhalten eine Bestätigung per E-Mail. Kann ich Ihnen noch bei etwas anderem helfen?',

    // Contact
    'contact.title': 'Kontaktieren Sie uns',
    'contact.subtitle': 'Lassen Sie uns gemeinsam Ihre Geschäftsprozesse optimieren',
    'contact.name': 'Vollständiger Name',
    'contact.email': 'Geschäftliche E-Mail',
    'contact.business': 'Unternehmenstyp',
    'contact.requirements': 'Ihre Anforderungen',
    'contact.cta': 'Nachricht senden',
    'contact.privacy': 'Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.',
    'contact.directEmail': 'Oder kontaktieren Sie uns direkt: kontakt@lucidence.de',
    'contact.businessTypes.medical': 'Arztpraxis',
    'contact.businessTypes.dental': 'Zahnarztpraxis',
    'contact.businessTypes.legal': 'Anwaltskanzlei',
    'contact.businessTypes.other': 'Sonstiges',

    // Footer
    'footer.desc': 'Lucidence Solutions — KI-gestützte Lösungen für moderne Unternehmen in Deutschland und Europa.',
    'footer.products': 'Produkte',
    'footer.products.receptionist': 'KI-Rezeptionist',
    'footer.products.gdpr': 'DSGVO-Copilot',
    'footer.products.esg': 'ESG-Reporter',
    'footer.products.workflow': 'Workflow-Automatisierung',
    'footer.company': 'Unternehmen',
    'footer.company.about': 'Über uns',
    'footer.company.careers': 'Karriere',
    'footer.company.blog': 'Blog',
    'footer.company.contact': 'Kontakt',
    'footer.contact': 'Kontakt',
    'footer.contact.email': 'kontakt@lucidence.de',
    'footer.contact.phone': '+49 69 123 456 78',
    'footer.contact.address': 'Lucidence Solutions GmbH\nMusterstraße 42\n60311 Frankfurt am Main\nDeutschland',
    'footer.legal.privacy': 'Datenschutz',
    'footer.legal.terms': 'AGB',
    'footer.legal.imprint': 'Impressum',
    'footer.powered': 'Powered by ElevenLabs Agents',
    'footer.copyright': '© {year} Lucidence Solutions GmbH. Alle Rechte vorbehalten.',
  },
  en: {
    // Navbar
    'nav.howItWorks': 'How It Works',
    'nav.products': 'Products',
    'nav.pricing': 'Pricing',
    'nav.demo': 'Demo',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',

    // Hero
    'hero.headline': 'Never miss a customer again.',
    'hero.subheadline': 'Your 24/7 AI Receptionist — AI-powered, hosted in Germany.',
    'hero.compliance': '100% GDPR compliant',
    'hero.bullet1': 'Phone calls',
    'hero.bullet2': 'WhatsApp & Chat',
    'hero.bullet3': 'Auto booking',
    'hero.cta': 'Book a Demo',
    'hero.trust': '🇩🇪 Hosted in Frankfurt • 🔒 GDPR compliant',

    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'Get your AI receptionist up and running in three simple steps',
    'howItWorks.step1.title': 'Choose your business type',
    'howItWorks.step1.desc': 'Select your industry and tailor the AI assistant to your needs.',
    'howItWorks.step2.title': 'Customize your AI receptionist',
    'howItWorks.step2.desc': 'Configure responses, scheduling rules, and conversation flows.',
    'howItWorks.step3.title': 'Go live in minutes',
    'howItWorks.step3.desc': 'Activate your AI receptionist and start automating immediately.',

    // Products
    'products.title': 'Our Products',
    'products.subtitle': 'Tailored AI solutions for your business',
    'products.receptionist.category': 'Core Product',
    'products.receptionist.name': 'AI Receptionist',
    'products.receptionist.desc': 'Automated call answering, appointment booking, and customer support around the clock.',
    'products.gdpr.category': 'Compliance',
    'products.gdpr.name': 'GDPR Copilot',
    'products.gdpr.desc': 'Automated data protection compliance and documentation for your business.',
    'products.esg.category': 'Sustainability',
    'products.esg.name': 'ESG Reporter',
    'products.esg.desc': 'Automated ESG reporting and sustainability analytics.',
    'products.workflow.category': 'Automation',
    'products.workflow.name': 'AI Workflow Automation',
    'products.workflow.desc': 'Intelligent process automation for recurring business workflows.',
    'products.learnMore': 'Learn more',

    // Pricing
    'pricing.title': 'Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that fits your business. All plans include a free trial.',
    'pricing.starter': 'Starter',
    'pricing.starterDesc': 'Ideal for small businesses and solo practices.',
    'pricing.starterPrice': '99',
    'pricing.pro': 'Pro',
    'pricing.proDesc': 'For growing businesses with higher volume.',
    'pricing.proPrice': '249',
    'pricing.enterprise': 'Enterprise',
    'pricing.enterpriseDesc': 'For large organizations with custom requirements.',
    'pricing.enterprisePrice': '499',
    'pricing.mostPopular': 'Most Popular',
    'pricing.month': '/month',
    'pricing.cta': 'Start Free Trial',
    'pricing.trialNote': '14-day free trial — no credit card required',
    'pricing.hostingNote': '🇩🇪 All data hosted on German servers',
    // Starter features
    'pricing.starter.f1': 'Up to 100 calls/month',
    'pricing.starter.f2': 'AI Receptionist (Basic)',
    'pricing.starter.f3': 'Appointment booking',
    'pricing.starter.f4': 'Email support',
    'pricing.starter.f5': '1 user',
    // Pro features
    'pricing.pro.f1': 'Up to 500 calls/month',
    'pricing.pro.f2': 'AI Receptionist (Advanced)',
    'pricing.pro.f3': 'WhatsApp integration',
    'pricing.pro.f4': 'Priority support',
    'pricing.pro.f5': '5 users',
    'pricing.pro.f6': 'Advanced analytics',
    // Enterprise features
    'pricing.enterprise.f1': 'Unlimited calls',
    'pricing.enterprise.f2': 'Full AI suite',
    'pricing.enterprise.f3': 'Dedicated account manager',
    'pricing.enterprise.f4': 'Custom integrations',
    'pricing.enterprise.f5': 'Unlimited users',
    'pricing.enterprise.f6': 'SLA guarantee',
    'pricing.enterprise.f7': 'White-label option',

    // Why Lucidence
    'why.title': 'Why Lucidence AI',
    'why.subtitle': 'Trust in German quality and innovation',
    'why.gdpr.title': '100% GDPR Secure',
    'why.gdpr.desc': 'Full compliance with European data protection regulations.',
    'why.bilingual.title': 'Bilingual Support',
    'why.bilingual.desc': 'Seamless communication in German and English.',
    'why.eu.title': 'EU Server Hosting',
    'why.eu.desc': 'All data stored exclusively on EU servers.',
    'why.custom.title': 'Custom-Trained AI',
    'why.custom.desc': 'AI models tailored to your specific business.',
    'why.instant.title': 'Instant Setup',
    'why.instant.desc': 'Ready in minutes, no technical knowledge required.',
    'why.availability.title': '24/7 Availability',
    'why.availability.desc': 'Your AI receptionist works around the clock, every day.',

    // Demo
    'demo.title': 'Live Demo',
    'demo.subtitle': 'Experience our AI receptionist in action',
    'demo.tryLive': 'Try Live Demo',
    'demo.tryCall': 'Try Voice Call',
    'demo.tag1': 'Natural conversations',
    'demo.tag2': 'Auto booking',
    'demo.tag3': 'Multilingual',
    'demo.user1': 'Hi, I\'d like to schedule an appointment.',
    'demo.ai1': 'Of course! I can offer you the following times: Monday 2:00 PM, Tuesday 10:00 AM, or Wednesday 4:00 PM. Which works best for you?',
    'demo.user2': 'Tuesday at 10:00 AM would be perfect.',
    'demo.ai2': 'Wonderful! Your appointment on Tuesday at 10:00 AM is confirmed. You\'ll receive a confirmation via email. Is there anything else I can help you with?',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Let\'s optimize your business processes together',
    'contact.name': 'Full Name',
    'contact.email': 'Business Email',
    'contact.business': 'Business Type',
    'contact.requirements': 'Your Requirements',
    'contact.cta': 'Send Message',
    'contact.privacy': 'By submitting, you agree to our Privacy Policy.',
    'contact.directEmail': 'Or contact us directly: kontakt@lucidence.de',
    'contact.businessTypes.medical': 'Medical Practice',
    'contact.businessTypes.dental': 'Dental Practice',
    'contact.businessTypes.legal': 'Law Firm',
    'contact.businessTypes.other': 'Other',

    // Footer
    'footer.desc': 'Lucidence Solutions — AI-powered solutions for modern businesses in Germany and Europe.',
    'footer.products': 'Products',
    'footer.products.receptionist': 'AI Receptionist',
    'footer.products.gdpr': 'GDPR Copilot',
    'footer.products.esg': 'ESG Reporter',
    'footer.products.workflow': 'Workflow Automation',
    'footer.company': 'Company',
    'footer.company.about': 'About Us',
    'footer.company.careers': 'Careers',
    'footer.company.blog': 'Blog',
    'footer.company.contact': 'Contact',
    'footer.contact': 'Contact',
    'footer.contact.email': 'kontakt@lucidence.de',
    'footer.contact.phone': '+49 69 123 456 78',
    'footer.contact.address': 'Lucidence Solutions GmbH\nMusterstraße 42\n60311 Frankfurt am Main\nGermany',
    'footer.legal.privacy': 'Privacy',
    'footer.legal.terms': 'Terms',
    'footer.legal.imprint': 'Imprint',
    'footer.powered': 'Powered by ElevenLabs Agents',
    'footer.copyright': '© {year} Lucidence Solutions GmbH. All rights reserved.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('lucidence-language');
    return (stored as Language) || 'de';
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
