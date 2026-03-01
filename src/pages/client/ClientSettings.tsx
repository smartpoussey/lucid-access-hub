import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Building, CreditCard, Key, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClientSettings() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">{t('layout.settings')}</h1>
        </div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('settings.profile')}
              </CardTitle>
              <CardDescription>{t('settings.profileDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('settings.firstName')}</Label>
                  <Input placeholder="Max" />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.lastName')}</Label>
                  <Input placeholder="Müller" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.email')}</Label>
                <Input type="email" placeholder="client@example.de" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.phone')}</Label>
                <Input type="tel" placeholder="+49 69 123 456 78" />
              </div>
              <Button>{t('settings.saveChanges')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Profile (Client-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {t('settings.client.business')}
              </CardTitle>
              <CardDescription>{t('settings.client.businessDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.client.businessName')}</Label>
                <Input placeholder="Meine Praxis GmbH" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.client.businessAddress')}</Label>
                <Input placeholder="Musterstraße 42" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.client.businessCity')}</Label>
                <Input placeholder="Frankfurt am Main" />
              </div>
              <Button>{t('settings.saveChanges')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing (Client-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t('settings.client.billing')}
              </CardTitle>
              <CardDescription>{t('settings.client.billingDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.client.currentPlan')}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-primary/10 text-primary">Pro</Badge>
                    <span className="text-sm text-muted-foreground">€249/{t('pricing.month').replace('/', '')}</span>
                  </div>
                </div>
                <Button variant="outline">{t('settings.client.upgradePlan')}</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Access (Client-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                {t('settings.client.apiAccess')}
              </CardTitle>
              <CardDescription>{t('settings.client.apiAccessDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.client.apiKey')}</Label>
                <div className="flex gap-2">
                  <Input value="luc_••••••••••••••••" readOnly className="flex-1 font-mono" />
                  <Button variant="outline">{t('settings.client.regenerateKey')}</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.client.webhookUrl')}</Label>
                <Input placeholder="https://your-domain.com/webhook" />
              </div>
              <Button>{t('settings.saveChanges')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Export (Client-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                {t('settings.client.dataExport')}
              </CardTitle>
              <CardDescription>{t('settings.client.dataExportDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">{t('settings.client.exportAll')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                {t('settings.notifications')}
              </CardTitle>
              <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.emailNotif')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.emailNotifDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.smsNotif')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.smsNotifDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.pushNotif')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.pushNotifDesc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t('settings.security')}
              </CardTitle>
              <CardDescription>{t('settings.securityDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.twoFactor')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.twoFactorDesc')}</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t('settings.changePassword')}</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder={t('settings.newPassword')} className="flex-1" />
                  <Button variant="outline">{t('settings.update')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                {t('settings.appearance')}
              </CardTitle>
              <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.darkMode')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.darkModeDesc')}</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.compactView')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.compactViewDesc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
