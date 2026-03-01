import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AdminRegistrationForm } from '@/components/registration/AdminRegistrationForm';
import { StaffRegistrationForm } from '@/components/registration/StaffRegistrationForm';
import { ClientRegistrationForm } from '@/components/registration/ClientRegistrationForm';
import { Shield, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type RoleType = 'admin' | 'staff' | 'client';

const RegisterRole = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>('client');
  const { t } = useLanguage();

  const renderForm = () => {
    switch (selectedRole) {
      case 'admin':
        return <AdminRegistrationForm />;
      case 'staff':
        return <StaffRegistrationForm />;
      case 'client':
        return <ClientRegistrationForm />;
      default:
        return <ClientRegistrationForm />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{t('registerRole.title')}</h1>
          <p className="text-muted-foreground">{t('registerRole.subtitle')}</p>
        </div>

        <ToggleGroup
          type="single"
          value={selectedRole}
          onValueChange={(value) => value && setSelectedRole(value as RoleType)}
          className="w-full justify-center gap-2"
        >
          <ToggleGroupItem value="admin" aria-label="Admin" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <Shield className="h-4 w-4 mr-2" />
            {t('register.roleAdmin')}
          </ToggleGroupItem>
          <ToggleGroupItem value="staff" aria-label="Staff" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <Users className="h-4 w-4 mr-2" />
            {t('register.roleStaff')}
          </ToggleGroupItem>
          <ToggleGroupItem value="client" aria-label="Client" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <Briefcase className="h-4 w-4 mr-2" />
            {t('register.roleClient')}
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="mt-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterRole;
