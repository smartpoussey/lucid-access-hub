import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye,
  Mail, Phone, Globe, Calendar
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
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
import { getAllLeads } from '@/services/firestore.service';
import type { Lead } from '@/types';

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Demo data for illustration
  const demoLeads: Lead[] = [
    {
      leadId: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@bayareamedical.com',
      phone: '+1 (555) 123-4567',
      source: 'google_search',
      country: 'US',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      leadId: '2',
      name: 'Michael Chen',
      email: 'mchen@pacificdental.com',
      phone: '+1 (555) 234-5678',
      source: 'referral',
      country: 'US',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      leadId: '3',
      name: 'Emily Roberts',
      email: 'emily@sunrisewellness.com',
      phone: '+1 (555) 345-6789',
      source: 'social_media',
      country: 'UK',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery]);

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
          lead.email.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
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

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      google_search: 'Google Search',
      social_media: 'Social Media',
      referral: 'Referral',
      advertisement: 'Advertisement',
      conference: 'Conference',
      other: 'Other',
    };
    return labels[source] || source;
  };

  const getCountryLabel = (country: string) => {
    const labels: Record<string, string> = {
      US: 'United States',
      UK: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
      IN: 'India',
      DE: 'Germany',
      FR: 'France',
      other: 'Other',
    };
    return labels[country] || country;
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
              placeholder="Search by name or email..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                      <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Country</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Source</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
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
                          <td className="p-4 text-foreground">{lead.phone}</td>
                          <td className="p-4 text-muted-foreground hidden md:table-cell">{getCountryLabel(lead.country)}</td>
                          <td className="p-4 hidden md:table-cell">
                            <Badge variant="secondary" className="bg-secondary">
                              {getSourceLabel(lead.source)}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground hidden lg:table-cell">{formatDate(lead.createdAt)}</td>
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
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Lead Details</DialogTitle>
            <DialogDescription>
              View lead information.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
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
                    <p className="text-foreground">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-foreground">{getCountryLabel(selectedLead.country)}</p>
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

              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-2">Source</p>
                <Badge variant="secondary">{getSourceLabel(selectedLead.source)}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
