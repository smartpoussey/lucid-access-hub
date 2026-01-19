import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PatientRow } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface RecentPatientsListProps {
  patients: PatientRow[];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getUrgencyColor(urgency: 'low' | 'medium' | 'high') {
  switch (urgency) {
    case 'low':
      return 'bg-success/10 text-success border-success/20';
    case 'medium':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20';
  }
}

function getPatientTypeColor(type: 'new' | 'existing') {
  return type === 'new'
    ? 'bg-primary/10 text-primary border-primary/20'
    : 'bg-muted text-muted-foreground border-border';
}

export function RecentPatientsList({ patients }: RecentPatientsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Recent Patients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[320px]">
            <div className="space-y-1 p-4 pt-0">
              {patients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No patients found
                </p>
              ) : (
                patients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {patient.phone || 'No phone'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={cn('text-xs capitalize', getPatientTypeColor(patient.patientType))}
                      >
                        {patient.patientType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn('text-xs capitalize', getUrgencyColor(patient.urgency))}
                      >
                        {patient.urgency}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
