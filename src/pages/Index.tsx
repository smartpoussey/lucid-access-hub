import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Zap,
  Bot,
  Check,
  Phone,
  MessageSquare,
  CalendarCheck,
  Sparkles,
  Globe,
  Clock,
  Cpu,
  Rocket,
  ShieldCheck,
  Languages,
  Server,
  Brain,
  Menu,
  X,
  Send,
  Mic,
  User,
  Mail,
  Building2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Index() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#products', label: t('nav.products') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#demo', label: t('nav.demo') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 flex-shrink-0">
            <div className="rounded-l flex items-center justify-center" style={{ height: '55px', overflow: 'hidden' }}>
              <img className='h-auto dark:invert dark:brightness-200'
                src="./assets/lucidence-logo-DNPRbMjo.png"
                alt="Lucidence"
                style={{ width: '180px', height: 'auto', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </Link>

          {/* Center: Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">{t('nav.login')}</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground">
                {t('nav.getStarted')}
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
              <Link to="/signup"><Button size="sm" className="bg-primary text-primary-foreground">{t('nav.getStarted')}</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'var(--gradient-glow)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              {t('hero.compliance')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              {t('hero.headline')}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subheadline')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="h-4 w-4 text-primary" /> {t('hero.bullet1')}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MessageSquare className="h-4 w-4 text-primary" /> {t('hero.bullet2')}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CalendarCheck className="h-4 w-4 text-primary" /> {t('hero.bullet3')}
              </div>
            </div>

            <a href="#demo">
              <Button size="lg" className="bg-primary text-primary-foreground">
                {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            <p className="mt-8 text-sm text-muted-foreground">{t('hero.trust')}</p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('howItWorks.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: '01', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc'), icon: Building2 },
              { num: '02', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc'), icon: Cpu },
              { num: '03', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc'), icon: Rocket },
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full text-center border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-display font-bold text-primary">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('products.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('products.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { key: 'receptionist', icon: Bot },
              { key: 'gdpr', icon: Shield },
              { key: 'esg', icon: Globe },
              { key: 'workflow', icon: Zap },
            ].map((product, i) => (
              <motion.div key={product.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3 text-xs">{t(`products.${product.key}.category`)}</Badge>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <product.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-semibold text-foreground mb-2">{t(`products.${product.key}.name`)}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t(`products.${product.key}.desc`)}</p>
                        <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t('products.learnMore')} <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('pricing.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { key: 'starter', price: t('pricing.starterPrice'), features: ['f1', 'f2', 'f3', 'f4', 'f5'], highlighted: false },
              { key: 'pro', price: t('pricing.proPrice'), features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'], highlighted: true },
              { key: 'enterprise', price: t('pricing.enterprisePrice'), features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'], highlighted: false },
            ].map((plan, i) => (
              <motion.div key={plan.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={`h-full relative ${plan.highlighted ? 'border-primary shadow-lg' : 'border-border/50'}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {t('pricing.mostPopular')}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-display font-semibold text-foreground mb-1">{t(`pricing.${plan.key}`)}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t(`pricing.${plan.key}Desc`)}</p>
                    <div className="mb-6">
                      <span className="text-3xl font-display font-bold text-foreground">€{plan.price}</span>
                      <span className="text-muted-foreground">{t('pricing.month')}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{t(`pricing.${plan.key}.${f}`)}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className="block">
                      <Button className={`w-full ${plan.highlighted ? 'bg-primary text-primary-foreground' : ''}`} variant={plan.highlighted ? 'default' : 'outline'}>
                        {t('pricing.cta')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">{t('pricing.trialNote')}</p>
            <p className="text-sm text-muted-foreground">{t('pricing.hostingNote')}</p>
          </div>
        </div>
      </section>

      {/* ─── WHY LUCIDENCE ─── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('why.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('why.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { key: 'gdpr', icon: ShieldCheck },
              { key: 'bilingual', icon: Languages },
              { key: 'eu', icon: Server },
              { key: 'custom', icon: Brain },
              { key: 'instant', icon: Rocket },
              { key: 'availability', icon: Clock },
            ].map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">{t(`why.${item.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`why.${item.key}.desc`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO ─── */}
      <section id="demo" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('demo.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('demo.subtitle')}</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Chat conversation */}
            <Card className="border-border/50 mb-6">
              <CardContent className="p-6 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">{t('demo.user1')}</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Lucidence AI</span>
                    </div>
                    <p className="text-sm text-foreground">{t('demo.ai1')}</p>
                  </div>
                </div>
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">{t('demo.user2')}</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Lucidence AI</span>
                    </div>
                    <p className="text-sm text-foreground">{t('demo.ai2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button size="lg" className="bg-primary text-primary-foreground">
                <Send className="mr-2 h-4 w-4" /> {t('demo.tryLive')}
              </Button>
              <Button size="lg" variant="outline">
                <Mic className="mr-2 h-4 w-4" /> {t('demo.tryCall')}
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">{t('demo.tag1')}</Badge>
              <Badge variant="secondary">{t('demo.tag2')}</Badge>
              <Badge variant="secondary">{t('demo.tag3')}</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('contact.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('contact.name')} className="pl-10" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('contact.email')} type="email" className="pl-10" />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm text-foreground">
                    <option value="">{t('contact.business')}</option>
                    <option value="medical">{t('contact.businessTypes.medical')}</option>
                    <option value="dental">{t('contact.businessTypes.dental')}</option>
                    <option value="legal">{t('contact.businessTypes.legal')}</option>
                    <option value="other">{t('contact.businessTypes.other')}</option>
                  </select>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea placeholder={t('contact.requirements')} className="pl-10 min-h-[100px]" />
                </div>
                <Button className="w-full bg-primary text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" /> {t('contact.cta')}
                </Button>
                <p className="text-xs text-muted-foreground text-center">{t('contact.privacy')}</p>
                <p className="text-xs text-muted-foreground text-center">{t('contact.directEmail')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center justify-center gap-2 mb-4">
                <div className="rounded-l flex items-center justify-center" style={{ height: '55px', overflow: 'hidden' }}>
                  <img className='h-auto dark:invert dark:brightness-200'
                    src="./assets/lucidence-logo-DNPRbMjo.png"
                    alt="Lucidence"
                    style={{ width: '180px', height: 'auto', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
              </Link>
              <p className="text-muted-foreground text-sm">{t('footer.desc')}</p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.products')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.products.receptionist')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.products.gdpr')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.products.esg')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.products.workflow')}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.about')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.careers')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.blog')}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.contact')}</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('footer.contact.email')}</li>
                <li>{t('footer.contact.phone')}</li>
                <li className="whitespace-pre-line">{t('footer.contact.address')}</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.legal.privacy')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.legal.terms')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.legal.imprint')}</a>
            </div>
            <p className="text-xs">{t('footer.powered')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
