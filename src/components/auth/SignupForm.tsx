import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Building2, MapPin, MessageSquare, 
  Loader2, ChevronRight, ChevronLeft, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createLead } from '@/services/firestore.service';
import { useToast } from '@/hooks/use-toast';
import type { ReferralSource } from '@/types';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(255),
  mobileNumber: z.string().min(10, 'Please enter a valid phone number').max(20),
  clinicName: z.string().min(2, 'Clinic/Business name is required').max(200),
  address: z.string().min(5, 'Please enter a valid address').max(500),
  location: z.string().min(2, 'Location is required').max(200),
  reasonForContact: z.string().min(10, 'Please tell us more about your needs').max(1000),
  referralSource: z.string().min(1, 'Please select how you heard about us'),
  hasExistingWebsite: z.boolean(),
  hasChatbot: z.boolean(),
  hasAIAgent: z.boolean(),
  hasReceptionist: z.boolean(),
  hasAutomationTools: z.boolean(),
  additionalNotes: z.string().max(500).optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const referralOptions: { value: ReferralSource; label: string }[] = [
  { value: 'google_search', label: 'Google Search' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'referral', label: 'Referral from a friend/colleague' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'conference', label: 'Conference/Event' },
  { value: 'other', label: 'Other' },
];

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      hasExistingWebsite: false,
      hasChatbot: false,
      hasAIAgent: false,
      hasReceptionist: false,
      hasAutomationTools: false,
    },
  });

  const validateStep = async (currentStep: number) => {
    const fieldsToValidate: (keyof SignupFormData)[][] = [
      ['name', 'email', 'mobileNumber'],
      ['clinicName', 'address', 'location'],
      ['reasonForContact', 'referralSource'],
    ];
    
    return await trigger(fieldsToValidate[currentStep - 1]);
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await createLead({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        clinicName: data.clinicName,
        address: data.address,
        location: data.location,
        reasonForContact: data.reasonForContact,
        referralSource: data.referralSource as ReferralSource,
        hasExistingWebsite: data.hasExistingWebsite,
        hasChatbot: data.hasChatbot,
        hasAIAgent: data.hasAIAgent,
        hasReceptionist: data.hasReceptionist,
        hasAutomationTools: data.hasAutomationTools,
        additionalNotes: data.additionalNotes,
      });
      toast({
        title: 'Application Submitted!',
        description: 'Thank you for your interest. Our team will review your application and contact you soon.',
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="w-full max-w-lg">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                s < step
                  ? 'bg-primary text-primary-foreground'
                  : s === step
                  ? 'bg-primary text-primary-foreground glow-sm'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {s < step ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-full h-1 mx-2 ${
                  s < step ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ width: '60px' }}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Personal Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Smith"
                  className="pl-10 bg-secondary border-border"
                  {...register('name')}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@clinic.com"
                  className="pl-10 bg-secondary border-border"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobileNumber"
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 bg-secondary border-border"
                  {...register('mobileNumber')}
                />
              </div>
              {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Business Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic / Business Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clinicName"
                  placeholder="Smith Medical Center"
                  className="pl-10 bg-secondary border-border"
                  {...register('clinicName')}
                />
              </div>
              {errors.clinicName && <p className="text-sm text-destructive">{errors.clinicName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="123 Medical Drive, Suite 100"
                  className="pl-10 bg-secondary border-border min-h-[80px]"
                  {...register('address')}
                />
              </div>
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">City / State</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                className="bg-secondary border-border"
                {...register('location')}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Tell Us More
            </h3>

            <div className="space-y-2">
              <Label htmlFor="reasonForContact">Why are you contacting Lucidence?</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="reasonForContact"
                  placeholder="Tell us about your needs, challenges, and goals..."
                  className="pl-10 bg-secondary border-border min-h-[120px]"
                  {...register('reasonForContact')}
                />
              </div>
              {errors.reasonForContact && <p className="text-sm text-destructive">{errors.reasonForContact.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Select
                onValueChange={(value) => setValue('referralSource', value)}
                defaultValue={watch('referralSource')}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {referralOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.referralSource && <p className="text-sm text-destructive">{errors.referralSource.message}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 4: Survey */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6">
              Current Setup Survey
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              This helps us understand your current technology stack.
            </p>

            <div className="space-y-4">
              {[
                { id: 'hasExistingWebsite', label: 'Do you have an existing website?' },
                { id: 'hasChatbot', label: 'Do you have a chatbot?' },
                { id: 'hasAIAgent', label: 'Do you use any AI agents?' },
                { id: 'hasReceptionist', label: 'Do you have a virtual receptionist?' },
                { id: 'hasAutomationTools', label: 'Do you use automation tools?' },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <Checkbox
                    id={item.id}
                    checked={watch(item.id as keyof SignupFormData) as boolean}
                    onCheckedChange={(checked) => setValue(item.id as keyof SignupFormData, checked as boolean)}
                  />
                  <Label htmlFor={item.id} className="cursor-pointer flex-1">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any other information you'd like to share..."
                className="bg-secondary border-border min-h-[80px]"
                {...register('additionalNotes')}
              />
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="border-border"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-primary text-primary-foreground"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
