import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Settings, Database, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminSettings() {
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
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.lastName')}</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.email')}</Label>
                <Input type="email" placeholder="admin@lucidence.de" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.phone')}</Label>
                <Input type="tel" placeholder="+49 69 123 456 78" />
              </div>
              <Button>{t('settings.saveChanges')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Settings (Admin-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {t('settings.admin.platformTitle')}
              </CardTitle>
              <CardDescription>{t('settings.admin.platformDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.admin.registrations')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.admin.registrationsDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.admin.maintenance')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.admin.maintenanceDesc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Management (Admin-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t('settings.admin.userManagement')}
              </CardTitle>
              <CardDescription>{t('settings.admin.userManagementDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.admin.defaultRole')}</Label>
                <Select defaultValue="client">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">{t('register.roleClient')}</SelectItem>
                    <SelectItem value="staff">{t('register.roleStaff')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.admin.autoApprove')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.admin.autoApproveDesc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Retention (Admin-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                {t('settings.admin.dataRetention')}
              </CardTitle>
              <CardDescription>{t('settings.admin.dataRetentionDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.admin.retentionPeriod')}</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">{t('settings.admin.days30')}</SelectItem>
                    <SelectItem value="90">{t('settings.admin.days90')}</SelectItem>
                    <SelectItem value="180">{t('settings.admin.days180')}</SelectItem>
                    <SelectItem value="365">{t('settings.admin.days365')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.admin.auditLog')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.admin.auditLogDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
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
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
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
