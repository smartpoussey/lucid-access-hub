import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Eye, Check, X, Phone as PhoneIcon,
  Mail, MapPin, Calendar, Loader2, MessageSquare, Building
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { registerClientFromLead } from '@/services/auth.service';
import { toast } from 'sonner';
import type { Lead, LeadStatus } from '@/types';

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Approval dialog state
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalLead, setApprovalLead] = useState<Lead | null>(null);
  const [approvalPassword, setApprovalPassword] = useState('');
  const [approvalConfirmPassword, setApprovalConfirmPassword] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  
  // Rejection/Contact dialog state
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'rejected' | 'contacted'>('rejected');
  const [actionLead, setActionLead] = useState<Lead | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

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
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error('Failed to load leads');
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
          lead.businessName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'N/A';
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

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>;
      case 'contacted':
        return <Badge className="bg-accent/20 text-accent">Contacted</Badge>;
      case 'approved':
        return <Badge className="bg-success/20 text-success">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/20 text-destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Open approval dialog
  const openApprovalDialog = (lead: Lead) => {
    setApprovalLead(lead);
    setApprovalPassword('');
    setApprovalConfirmPassword('');
    setIsApprovalDialogOpen(true);
  };

  // Handle lead approval with client registration
  const handleApprove = async () => {
    if (!approvalLead) return;
    
    if (approvalPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (approvalPassword !== approvalConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsApproving(true);
    try {
      // Register the client in Firebase Auth and Firestore
      await registerClientFromLead(
        approvalLead.email,
        approvalLead.name,
        approvalPassword
      );
      
      // Update lead status to approved
      await updateLeadStatus(approvalLead.leadId, 'approved');
      
      toast.success(`${approvalLead.name} has been approved and registered as a client`);
      setIsApprovalDialogOpen(false);
      loadLeads();
    } catch (error: any) {
      console.error('Error approving lead:', error);
      toast.error(error?.message || 'Failed to approve lead');
    } finally {
      setIsApproving(false);
    }
  };

  // Open rejection/contacted dialog
  const openActionDialog = (lead: Lead, type: 'rejected' | 'contacted') => {
    setActionLead(lead);
    setActionType(type);
    setActionNotes('');
    setIsActionDialogOpen(true);
  };

  // Handle rejection or mark contacted
  const handleAction = async () => {
    if (!actionLead) return;

    setIsProcessingAction(true);
    try {
      await updateLeadStatus(actionLead.leadId, actionType, actionNotes || undefined);
      
      const message = actionType === 'rejected' 
        ? `${actionLead.name} has been rejected`
        : `${actionLead.name} has been marked as contacted`;
      toast.success(message);
      setIsActionDialogOpen(false);
      loadLeads();
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error(error?.message || 'Failed to update lead');
    } finally {
      setIsProcessingAction(false);
    }
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
              placeholder="Search by name, email, or business..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
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
                      <th className="text-left p-4 font-medium text-muted-foreground">Business</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Source</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
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
                          <td className="p-4">
                            <p className="text-foreground">{lead.businessName || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{lead.city}</p>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            {getStatusBadge(lead.status || 'pending')}
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <Badge variant="secondary" className="bg-secondary">
                              {getSourceLabel(lead.source)}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground hidden lg:table-cell">{formatDate(lead.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(lead.status === 'pending' || !lead.status) && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-accent hover:text-accent"
                                    onClick={() => openActionDialog(lead, 'contacted')}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-success hover:text-success"
                                    onClick={() => openApprovalDialog(lead)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => openActionDialog(lead, 'rejected')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {lead.status === 'contacted' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-success hover:text-success"
                                    onClick={() => openApprovalDialog(lead)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => openActionDialog(lead, 'rejected')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
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
              View lead information and notes.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {getStatusBadge(selectedLead.status || 'pending')}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedLead.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground">{selectedLead.mobile}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Business</p>
                    <p className="text-foreground">{selectedLead.businessName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground">{selectedLead.city}{selectedLead.address ? `, ${selectedLead.address}` : ''}</p>
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

              {selectedLead.reasonForApproaching && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-2">Reason for Approaching</p>
                  <p className="text-foreground">{selectedLead.reasonForApproaching}</p>
                </div>
              )}

              {selectedLead.additionalNotes && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-foreground">{selectedLead.additionalNotes}</p>
                </div>
              )}

              {/* Survey Info */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-2">Current Setup</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.hasWebsite && <Badge variant="outline">Has Website</Badge>}
                  {selectedLead.hasChatbot && <Badge variant="outline">Has Chatbot</Badge>}
                  {selectedLead.hasAiAgent && <Badge variant="outline">Has AI Agent</Badge>}
                  {selectedLead.hasReceptionist && <Badge variant="outline">Has Receptionist</Badge>}
                  {!selectedLead.hasWebsite && !selectedLead.hasChatbot && !selectedLead.hasAiAgent && !selectedLead.hasReceptionist && (
                    <span className="text-muted-foreground text-sm">No current setup specified</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Approve & Register Client</DialogTitle>
            <DialogDescription>
              Set login credentials for {approvalLead?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={approvalLead?.email || ''}
                disabled
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={approvalLead?.name || ''}
                disabled
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={approvalPassword}
                onChange={(e) => setApprovalPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={approvalConfirmPassword}
                onChange={(e) => setApprovalConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve & Register
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection/Contact dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {actionType === 'rejected' ? 'Reject Lead' : 'Mark as Contacted'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'rejected' 
                ? `Reject ${actionLead?.name}'s application`
                : `Mark ${actionLead?.name} as contacted`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={actionType === 'rejected' 
                  ? 'Reason for rejection...' 
                  : 'Contact notes...'
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActionDialogOpen(false)}
              disabled={isProcessingAction}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isProcessingAction}
              variant={actionType === 'rejected' ? 'destructive' : 'default'}
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : actionType === 'rejected' ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mark Contacted
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
