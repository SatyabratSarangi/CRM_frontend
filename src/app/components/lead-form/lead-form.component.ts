import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CustomerLeadService } from '../../services/customer-lead.service';
import { LeadTypeService } from '../../services/lead-type.service';
import { LeadType } from '../../models/lead-type.model';
import { LEAD_STATUSES, LEAD_PRIORITIES, LEAD_SOURCES } from '../../models/customer-lead.model';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css']
})
export class LeadFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isEdit = false;
  leadId?: number;
  leadTypes: LeadType[] = [];
  statuses = LEAD_STATUSES;
  priorities = LEAD_PRIORITIES;
  leadSources = LEAD_SOURCES;
  loading = false;
  pageLoading = true;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private leadService: CustomerLeadService,
    private leadTypeService: LeadTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLeadTypes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.leadId = +id;
      this.loadLead(this.leadId);
    } else {
      this.pageLoading = false;
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternateNumber: [''],
      email: ['', Validators.email],
      leadType: [null, Validators.required],
      city: [''],
      address: [''],
      requirement: [''],
      leadSource: [''],
      discussionDetails: [''],
      visitDate: [''],
      nextFollowUpDate: [''],
      status: ['New', Validators.required],
      priority: ['', Validators.required]
    });
  }

  loadLeadTypes(): void {
    this.subs.add(
      this.leadTypeService.getAll().subscribe({
        next: (types) => this.leadTypes = types
      })
    );
  }

  loadLead(id: number): void {
    this.subs.add(
      this.leadService.getById(id).subscribe({
        next: (lead) => {
          this.form.patchValue({
            customerName: lead.customerName,
            mobile: lead.mobile,
            alternateNumber: lead.alternateNumber,
            email: lead.email,
            leadType: lead.leadType,
            city: lead.city,
            address: lead.address,
            requirement: lead.requirement,
            leadSource: lead.leadSource,
            discussionDetails: lead.discussionDetails,
            visitDate: lead.visitDate,
            nextFollowUpDate: lead.nextFollowUpDate,
            status: lead.status,
            priority: lead.priority
          });
          this.pageLoading = false;
        },
        error: () => {
          this.snackBar.open('Failed to load lead', 'Close', { duration: 3000 });
          this.router.navigate(['/leads']);
        }
      })
    );
  }

  compareLeadType(lt1: LeadType, lt2: LeadType): boolean {
    return lt1 && lt2 ? lt1.id === lt2.id : lt1 === lt2;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }
    this.loading = true;

    const leadData = this.form.value;

    if (this.isEdit && this.leadId) {
      this.subs.add(
        this.leadService.update(this.leadId, leadData).subscribe({
          next: () => {
            this.snackBar.open('Lead updated successfully', 'Close', { duration: 2000 });
            this.router.navigate(['/leads', this.leadId]);
          },
          error: (err) => {
            this.loading = false;
            this.snackBar.open(err.error?.message || 'Failed to update lead', 'Close', { duration: 3000 });
          }
        })
      );
    } else {
      this.subs.add(
        this.leadService.create(leadData).subscribe({
          next: (created) => {
            this.snackBar.open('Lead created successfully', 'Close', { duration: 2000 });
            this.router.navigate(['/leads', created.id]);
          },
          error: (err) => {
            this.loading = false;
            this.snackBar.open(err.error?.message || 'Failed to create lead', 'Close', { duration: 3000 });
          }
        })
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/leads']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
