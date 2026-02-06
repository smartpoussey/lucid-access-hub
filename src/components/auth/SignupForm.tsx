import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createLead } from '@/services/firestore.service';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email').max(255),
  mobile: z.string().min(10, 'Enter a valid phone number').max(20),
  businessName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  reasonForApproaching: z.string().optional(),
  source: z.string().optional(),
});

type SignupFormInput = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormInput) => {
    setIsSubmitting(true);
    try {
      await createLead({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        businessName: data.businessName || '',
        address: data.address || '',
        city: data.city || '',
        reasonForApproaching: data.reasonForApproaching || '',
        source: data.source || '',
        status: 'pending',
        hasWebsite: false,
        hasChatbot: false,
        hasAiAgent: false,
        hasReceptionist: false,
      });
      toast({
        title: 'Application submitted',
        description: 'Thank you! Our team will contact you soon.',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 bg-secondary border-border"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="mobile"
              placeholder="+1 (555) 000-0000"
              className="pl-10 bg-secondary border-border"
              {...register('mobile')}
            />
          </div>
          {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </motion.div>
  );
}
