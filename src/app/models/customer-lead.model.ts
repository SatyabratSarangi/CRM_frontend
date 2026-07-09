import { LeadType } from './lead-type.model';

export interface CustomerLead {
  id?: number;
  customerName: string;
  mobile: string;
  alternateNumber?: string;
  email?: string;
  leadType: LeadType;
  city?: string;
  address?: string;
  requirement?: string;
  leadSource?: string;
  assignedExecutive?: { id: number; username: string; role: string };
  discussionDetails?: string;
  visitDate?: string;
  nextFollowUpDate?: string;
  status: string;
  priority: string;
  createdDate?: string;
}

export const LEAD_STATUSES = [
  'New', 'Contacted', 'Interested', 'Follow Up',
  'Visit Scheduled', 'Negotiation', 'Closed Won',
  'Closed Lost', 'Not Interested'
];

export const LEAD_PRIORITIES = ['Hot', 'Warm', 'Cold', 'Not a Customer'];

export const LEAD_SOURCES = [
  'Website', 'Referral', 'Social Media', 'Cold Call',
  'Email Campaign', 'Walk-in', 'Advertisement', 'Other'
];
