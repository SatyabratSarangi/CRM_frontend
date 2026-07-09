import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CustomerLeadService } from '../../services/customer-lead.service';
import { AuthService } from '../../services/auth.service';
import { CustomerLead, LEAD_STATUSES, LEAD_PRIORITIES } from '../../models/customer-lead.model';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<CustomerLead>([]);
  displayedColumns = ['customerName', 'mobile', 'email', 'leadType', 'city', 'status', 'priority', 'createdDate', 'actions'];
  statuses = LEAD_STATUSES;
  priorities = LEAD_PRIORITIES;
  loading = true;

  // Search filters
  searchName = '';
  searchStatus = '';
  searchPriority = '';
  searchCity = '';

  private subs = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private leadService: CustomerLeadService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canDeleteLeads(): boolean {
    return this.authService.hasRole(['ADMIN', 'MANAGER']);
  }

  ngOnInit(): void {
    this.loadLeads();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadLeads(): void {
    this.loading = true;
    this.subs.add(
      this.leadService.getAll().subscribe({
        next: (leads) => {
          this.dataSource.data = leads;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to load leads', 'Close', { duration: 3000 });
        }
      })
    );
  }

  searchLeads(): void {
    const hasFilters = this.searchName || this.searchStatus || this.searchPriority || this.searchCity;
    if (!hasFilters) {
      this.loadLeads();
      return;
    }

    this.loading = true;
    this.subs.add(
      this.leadService.search({
        name: this.searchName,
        status: this.searchStatus,
        priority: this.searchPriority,
        city: this.searchCity
      }).subscribe({
        next: (leads) => {
          this.dataSource.data = leads;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Search failed', 'Close', { duration: 3000 });
        }
      })
    );
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchStatus = '';
    this.searchPriority = '';
    this.searchCity = '';
    this.loadLeads();
  }

  viewLead(id: number): void {
    this.router.navigate(['/leads', id]);
  }

  editLead(id: number): void {
    this.router.navigate(['/leads', id, 'edit']);
  }

  deleteLead(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete lead "${name}"?`)) {
      this.subs.add(
        this.leadService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Lead deleted successfully', 'Close', { duration: 2000 });
            this.loadLeads();
          },
          error: () => {
            this.snackBar.open('Failed to delete lead', 'Close', { duration: 3000 });
          }
        })
      );
    }
  }

  openWhatsApp(mobile: string): void {
    window.open(`https://wa.me/91${mobile}`, '_blank');
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
