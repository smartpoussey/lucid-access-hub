import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, CheckCircle, XCircle, Eye,
  Mail, Phone, Building2, MapPin, Calendar
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllLeads, updateLeadStatus } from '@/services/firestore.service';
import { useToast } from '@/hooks/use-toast';
import type { Lead } from '@/types';

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  // Demo data for illustration
  const demoLeads: Lead[] = [
    {
      leadId: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@bayareamedical.com',
      mobileNumber: '+1 (555) 123-4567',
      clinicName: 'Bay Area Medical Center',
      address: '123 Medical Drive, Suite 100',
      location: 'San Francisco, CA',
      reasonForContact: 'Looking to implement AI-powered patient scheduling and triage system for our multi-location practice.',
      referralSource: 'google_search',
      survey: {
        hasExistingWebsite: true,
        hasChatbot: false,
        hasAIAgent: false,
        hasReceptionist: true,
        hasAutomationTools: false,
      },
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      leadId: '2',
      name: 'Michael Chen',
      email: 'mchen@pacificdental.com',
      mobileNumber: '+1 (555) 234-5678',
      clinicName: 'Pacific Dental Group',
      address: '456 Dental Way',
      location: 'Los Angeles, CA',
      reasonForContact: 'Need a virtual receptionist to handle appointment bookings and patient inquiries.',
      referralSource: 'referral',
      survey: {
        hasExistingWebsite: true,
        hasChatbot: true,
        hasAIAgent: false,
        hasReceptionist: false,
        hasAutomationTools: true,
      },
      status: 'pending',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      leadId: '3',
      name: 'Emily Roberts',
      email: 'emily@sunrisewellness.com',
      mobileNumber: '+1 (555) 345-6789',
      clinicName: 'Sunrise Wellness Center',
      address: '789 Wellness Blvd',
      location: 'Seattle, WA',
      reasonForContact: 'Interested in comprehensive AI solutions for our holistic health practice.',
      referralSource: 'social_media',
      survey: {
        hasExistingWebsite: false,
        hasChatbot: false,
        hasAIAgent: false,
        hasReceptionist: true,
        hasAutomationTools: false,
      },
      status: 'approved',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLeads();
      setLeads(data.length > 0 ? data : demoLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeads(demoLeads);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.clinicName.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleStatusUpdate = async (leadId: string, status: 'approved' | 'rejected') => {
    try {
      await updateLeadStatus(leadId, status);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.leadId === leadId ? { ...lead, status } : lead
        )
      );
      setSelectedLead(null);
      toast({
        title: status === 'approved' ? 'Lead Approved' : 'Lead Rejected',
        description: status === 'approved' 
          ? 'The applicant will receive an email to set up their account.'
          : 'The applicant has been notified.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-foreground"
          >
            Leads Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2"
          >
            Review and manage incoming lead applications.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or clinic..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Leads table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Clinic</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          Loading leads...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No leads found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.leadId} className="border-b border-border hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            </div>
                          </td>
                          <td className="p-4 text-foreground">{lead.clinicName}</td>
                          <td className="p-4 text-muted-foreground hidden md:table-cell">{lead.location}</td>
                          <td className="p-4 text-muted-foreground hidden lg:table-cell">{formatDate(lead.createdAt)}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                lead.status === 'approved'
                                  ? 'default'
                                  : lead.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className={
                                lead.status === 'approved'
                                  ? 'bg-success/20 text-success hover:bg-success/30'
                                  : lead.status === 'pending'
                                  ? 'bg-warning/20 text-warning hover:bg-warning/30'
                                  : ''
                              }
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Lead detail dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Lead Details</DialogTitle>
            <DialogDescription>
              Review the application and take action.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{selectedLead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-foreground">{selectedLead.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clinic</p>
                      <p className="text-foreground">{selectedLead.clinicName}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">{selectedLead.address}</p>
                      <p className="text-foreground">{selectedLead.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Applied</p>
                      <p className="text-foreground">{formatDate(selectedLead.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-2">Reason for Contact</p>
                <p className="text-foreground">{selectedLead.reasonForContact}</p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-3">Survey Responses</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedLead.survey).map(([key, value]) => {
                    if (key === 'additionalNotes') return null;
                    const label = key.replace(/([A-Z])/g, ' $1').replace('has', 'Has').trim();
                    return (
                      <div key={key} className="flex items-center gap-2">
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedLead.status === 'pending' && (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedLead.leadId, 'rejected')}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedLead.leadId, 'approved')}
                    className="bg-success text-success-foreground hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
