import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, User, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  dateTime: Date;
  status: string;
  transcript: string;
}

interface AppointmentsPageProps {
  appointments: Appointment[];
  searchQuery: string;
}

type SortField = 'patientName' | 'dateTime' | 'status';
type SortDirection = 'asc' | 'desc';

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes('booked') || s.includes('confirmed')) {
    return 'bg-success/10 text-success border-success/20';
  }
  if (s.includes('pending') || s.includes('waiting')) {
    return 'bg-warning/10 text-warning border-warning/20';
  }
  if (s.includes('cancelled') || s.includes('missed')) {
    return 'bg-destructive/10 text-destructive border-destructive/20';
  }
  return 'bg-muted text-muted-foreground border-border';
}

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'No date';
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AppointmentsPage({ appointments, searchQuery }: AppointmentsPageProps) {
  const [sortField, setSortField] = useState<SortField>('dateTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedAppointments = useMemo(() => {
    const filtered = appointments.filter(
      (apt) =>
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone.includes(searchQuery)
    );

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'patientName':
          comparison = a.patientName.localeCompare(b.patientName);
          break;
        case 'dateTime':
          comparison = a.dateTime.getTime() - b.dateTime.getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [appointments, searchQuery, sortField, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              All Appointments ({filteredAndSortedAppointments.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patientName">Patient Name</SelectItem>
                  <SelectItem value="dateTime">Date & Time</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={toggleSortDirection} className="h-8 px-2">
                {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3 p-4 pt-0">
              {filteredAndSortedAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No appointments found
                  </p>
                </div>
              ) : (
                filteredAndSortedAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground">
                                {apt.patientName}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn('text-xs', getStatusColor(apt.status))}
                              >
                                {apt.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(apt.dateTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(apt.dateTime)}
                              </div>
                              {apt.patientPhone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {apt.patientPhone}
                                </div>
                              )}
                            </div>

                            {apt.transcript && (
                              <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded">
                                {apt.transcript}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
