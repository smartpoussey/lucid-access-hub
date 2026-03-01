import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Clock, FolderKanban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StaffSettings() {
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
                  <Input placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.lastName')}</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.email')}</Label>
                <Input type="email" placeholder="staff@lucidence.de" />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.phone')}</Label>
                <Input type="tel" placeholder="+49 69 123 456 78" />
              </div>
              <Button>{t('settings.saveChanges')}</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Availability (Staff-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('settings.staff.availability')}
              </CardTitle>
              <CardDescription>{t('settings.staff.availabilityDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.staff.available')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.staff.availableDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">{t('settings.staff.workingHours')}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t('settings.staff.startTime')}</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t('settings.staff.endTime')}</Label>
                    <Input type="time" defaultValue="17:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Preferences (Staff-only) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                {t('settings.staff.projectPrefs')}
              </CardTitle>
              <CardDescription>{t('settings.staff.projectPrefsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.staff.maxProjects')}</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{t('settings.staff.projectNotif')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.staff.projectNotifDesc')}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                  <Label className="text-sm font-medium">{t('settings.pushNotif')}</Label>
                  <p className="text-xs text-muted-foreground">{t('settings.pushNotifDesc')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
