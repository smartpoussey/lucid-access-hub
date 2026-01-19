import { useMemo } from 'react';
import type { 
  Contact, 
  Interaction, 
  DashboardStats, 
  ChartDataPoint, 
  PieChartDataPoint,
  PatientRow 
} from '@/types/dashboard';

interface CollectionData {
  name: string;
  documents: { id: string; data: Record<string, unknown> }[];
}

function parseContact(doc: { id: string; data: Record<string, unknown> }): Contact {
  const data = doc.data;
  return {
    id: doc.id,
    name: (data.name as string) || 'Unknown',
    email: (data.email as string) || '',
    mobileNumber: (data.mobileNumber as string) || '',
    patientId: (data.patientId as number) || 0,
    patientType: ((data.patientType as string) || 'new') as 'new' | 'existing',
    createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt as string || Date.now()),
    updatedAt: data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt as string || Date.now()),
  };
}

function parseInteraction(doc: { id: string; data: Record<string, unknown> }): Interaction {
  const data = doc.data;
  return {
    id: doc.id,
    patientId: (data.patientId as number) || 0,
    patientType: ((data.patientType as string) || 'new') as 'new' | 'existing',
    queryType: ((data.queryType as string) || 'Other') as Interaction['queryType'],
    queryStatus: (data.queryStatus as string) || 'pending',
    transcript: (data.transcript as string) || '',
    callDay: (data.callDay as string) || '',
    callHour: (data.callHour as number) || 0,
    callTimestamp: data.callTimestamp instanceof Date 
      ? data.callTimestamp 
      : new Date(data.callTimestamp as string || Date.now()),
    createdAt: data.createdAt instanceof Date 
      ? data.createdAt 
      : new Date(data.createdAt as string || Date.now()),
    updatedAt: data.updatedAt instanceof Date 
      ? data.updatedAt 
      : new Date(data.updatedAt as string || Date.now()),
  };
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getUrgency(queryStatus: string): 'low' | 'medium' | 'high' {
  const status = queryStatus.toLowerCase();
  if (status.includes('urgent') || status.includes('emergency')) return 'high';
  if (status.includes('pending') || status.includes('follow')) return 'medium';
  return 'low';
}

export function useDashboardData(collections: CollectionData[]) {
  // Parse contacts and interactions from collections
  const { contacts, interactions } = useMemo(() => {
    let contactDocs: Contact[] = [];
    let interactionDocs: Interaction[] = [];

    collections.forEach((collection) => {
      if (collection.name.toLowerCase().includes('contact')) {
        contactDocs = collection.documents.map(parseContact);
      } else if (collection.name.toLowerCase().includes('interaction')) {
        interactionDocs = collection.documents.map(parseInteraction);
      }
    });

    return { contacts: contactDocs, interactions: interactionDocs };
  }, [collections]);

  // Calculate dashboard stats
  const stats: DashboardStats = useMemo(() => {
    const totalPatients = contacts.length;
    const newPatientsToday = contacts.filter(
      (c) => c.patientType === 'new' && isToday(c.createdAt)
    ).length;
    const existingPatients = contacts.filter((c) => c.patientType === 'existing').length;
    const appointmentsToday = interactions.filter(
      (i) => i.queryType === 'Booking' && isToday(i.callTimestamp)
    ).length;

    return {
      totalPatients,
      newPatientsToday,
      existingPatients,
      appointmentsToday,
    };
  }, [contacts, interactions]);

  // Weekly chart data (New vs Existing patients)
  const weeklyChartData: ChartDataPoint[] = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data: ChartDataPoint[] = days.map((name) => ({ name, new: 0, existing: 0 }));

    interactions.forEach((interaction) => {
      const dayIndex = interaction.callTimestamp.getDay();
      if (interaction.patientType === 'new') {
        data[dayIndex].new += 1;
      } else {
        data[dayIndex].existing += 1;
      }
    });

    return data;
  }, [interactions]);

  // Patient distribution pie chart
  const patientDistribution: PieChartDataPoint[] = useMemo(() => {
    const newCount = contacts.filter((c) => c.patientType === 'new').length;
    const existingCount = contacts.filter((c) => c.patientType === 'existing').length;

    return [
      { name: 'New Patients', value: newCount, fill: 'hsl(174 72% 50%)' },
      { name: 'Existing Patients', value: existingCount, fill: 'hsl(222 47% 40%)' },
    ];
  }, [contacts]);

  // Urgency distribution bar chart
  const urgencyData: { name: string; count: number; fill: string }[] = useMemo(() => {
    let low = 0;
    let medium = 0;
    let high = 0;

    interactions.forEach((i) => {
      const urgency = getUrgency(i.queryStatus);
      if (urgency === 'low') low += 1;
      else if (urgency === 'medium') medium += 1;
      else high += 1;
    });

    return [
      { name: 'Low', count: low, fill: 'hsl(142 72% 45%)' },
      { name: 'Medium', count: medium, fill: 'hsl(38 92% 50%)' },
      { name: 'High', count: high, fill: 'hsl(0 72% 55%)' },
    ];
  }, [interactions]);

  // Recent patients list
  const recentPatients: PatientRow[] = useMemo(() => {
    // Merge contact info with latest interaction
    return contacts
      .slice(0, 10)
      .map((contact) => {
        const latestInteraction = interactions.find(
          (i) => i.patientId === contact.patientId
        );
        return {
          id: contact.id,
          name: contact.name,
          phone: contact.mobileNumber,
          patientType: contact.patientType,
          queryStatus: latestInteraction?.queryStatus || 'No interactions',
          urgency: latestInteraction ? getUrgency(latestInteraction.queryStatus) : 'low',
          createdAt: contact.createdAt,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [contacts, interactions]);

  // Appointments (filtered interactions)
  const appointments = useMemo(() => {
    return interactions
      .filter((i) => i.queryType === 'Booking')
      .map((i) => {
        const contact = contacts.find((c) => c.patientId === i.patientId);
        return {
          id: i.id,
          patientName: contact?.name || 'Unknown Patient',
          patientPhone: contact?.mobileNumber || '',
          dateTime: i.callTimestamp,
          status: i.queryStatus,
          transcript: i.transcript,
        };
      })
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  }, [interactions, contacts]);

  // All patients for patients page
  const allPatients: PatientRow[] = useMemo(() => {
    return contacts.map((contact) => {
      const latestInteraction = interactions.find(
        (i) => i.patientId === contact.patientId
      );
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.mobileNumber,
        patientType: contact.patientType,
        queryStatus: latestInteraction?.queryStatus || 'No interactions',
        urgency: latestInteraction ? getUrgency(latestInteraction.queryStatus) : 'low',
        createdAt: contact.createdAt,
      };
    });
  }, [contacts, interactions]);

  return {
    contacts,
    interactions,
    stats,
    weeklyChartData,
    patientDistribution,
    urgencyData,
    recentPatients,
    appointments,
    allPatients,
  };
}
