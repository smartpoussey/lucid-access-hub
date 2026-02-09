import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage}>
      <span className="text-base">{language === 'en' ? '🇺🇸' : '🇩🇪'}</span>
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
