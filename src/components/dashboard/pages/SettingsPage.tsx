import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

export function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-elevated">
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
                <Label htmlFor="firstName">{t('settings.firstName')}</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('settings.lastName')}</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.email')}</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('settings.phone')}</Label>
              <Input id="phone" type="tel" placeholder="+49 69 123 456 78" />
            </div>
            <Button className="mt-2">{t('settings.saveChanges')}</Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-elevated">
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="card-elevated">
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="card-elevated">
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
  );
}
