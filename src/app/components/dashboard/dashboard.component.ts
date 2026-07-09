import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { CustomerLeadService } from '../../services/customer-lead.service';
import { DashboardStats } from '../../models/dashboard.model';
import { CustomerLead } from '../../models/customer-lead.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = { totalLeads: 0, todayFollowUps: 0, hotCustomers: 0, closedDeals: 0 };
  recentLeads: CustomerLead[] = [];
  loading = true;
  private subs = new Subscription();

  statCards = [
    { icon: 'people', label: 'Total Leads', key: 'totalLeads', color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
    { icon: 'event', label: "Today's Follow-ups", key: 'todayFollowUps', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: 'local_fire_department', label: 'Hot Customers', key: 'hotCustomers', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { icon: 'check_circle', label: 'Closed Deals', key: 'closedDeals', color: '#25D366', bg: 'rgba(37,211,102,0.1)' }
  ];

  displayedColumns = ['customerName', 'mobile', 'status', 'priority', 'city', 'actions'];

  constructor(
    private dashboardService: DashboardService,
    private leadService: CustomerLeadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentLeads();
  }

  loadStats(): void {
    this.subs.add(
      this.dashboardService.getStats().subscribe({
        next: (data) => {
          this.stats = data;
          this.loading = false;
        },
        error: () => this.loading = false
      })
    );
  }

  loadRecentLeads(): void {
    this.subs.add(
      this.leadService.getAll().subscribe({
        next: (leads) => {
          this.recentLeads = leads.slice(0, 5);
        }
      })
    );
  }

  getStatValue(key: string): number {
    return (this.stats as any)[key] || 0;
  }

  viewLead(id: number): void {
    this.router.navigate(['/leads', id]);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'New': 'status-new', 'Contacted': 'status-contacted', 'Interested': 'status-interested',
      'Follow Up': 'status-followup', 'Visit Scheduled': 'status-visit',
      'Negotiation': 'status-negotiation', 'Closed Won': 'status-won',
      'Closed Lost': 'status-lost', 'Not Interested': 'status-not-interested'
    };
    return map[status] || 'status-new';
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      'Hot': 'priority-hot', 'Warm': 'priority-warm',
      'Cold': 'priority-cold', 'Not a Customer': 'priority-none'
    };
    return map[priority] || 'priority-none';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
