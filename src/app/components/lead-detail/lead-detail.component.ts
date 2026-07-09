import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CustomerLeadService } from '../../services/customer-lead.service';
import { FollowUpService } from '../../services/follow-up.service';
import { NoteService } from '../../services/note.service';
import { CustomerLead } from '../../models/customer-lead.model';
import { FollowUp } from '../../models/follow-up.model';
import { Note } from '../../models/note.model';
import { FollowUpDialogComponent } from '../follow-up-dialog/follow-up-dialog.component';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit, OnDestroy {
  lead?: CustomerLead;
  followUps: FollowUp[] = [];
  notes: Note[] = [];
  newNoteText = '';
  loading = true;
  addingNote = false;
  private leadId!: number;
  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: CustomerLeadService,
    private followUpService: FollowUpService,
    private noteService: NoteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.leadId = +this.route.snapshot.paramMap.get('id')!;
    this.loadLead();
    this.loadFollowUps();
    this.loadNotes();
  }

  loadLead(): void {
    this.subs.add(
      this.leadService.getById(this.leadId).subscribe({
        next: (lead) => {
          this.lead = lead;
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Failed to load lead', 'Close', { duration: 3000 });
          this.router.navigate(['/leads']);
        }
      })
    );
  }

  loadFollowUps(): void {
    this.subs.add(
      this.followUpService.getByLeadId(this.leadId).subscribe({
        next: (data) => this.followUps = data
      })
    );
  }

  loadNotes(): void {
    this.subs.add(
      this.noteService.getByLeadId(this.leadId).subscribe({
        next: (data) => this.notes = data
      })
    );
  }

  editLead(): void {
    this.router.navigate(['/leads', this.leadId, 'edit']);
  }

  openWhatsApp(): void {
    if (this.lead?.mobile) {
      window.open(`https://wa.me/91${this.lead.mobile}`, '_blank');
    }
  }

  openFollowUpDialog(): void {
    const dialogRef = this.dialog.open(FollowUpDialogComponent, {
      width: '520px',
      data: { leadId: this.leadId },
      panelClass: 'custom-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadFollowUps();
          this.loadLead(); // Refresh lead to get updated status/next follow-up
        }
      })
    );
  }

  addNote(): void {
    if (!this.newNoteText.trim()) return;
    this.addingNote = true;

    const note: Note = { noteText: this.newNoteText.trim() };
    this.subs.add(
      this.noteService.create(this.leadId, note).subscribe({
        next: () => {
          this.snackBar.open('Note added', 'Close', { duration: 2000 });
          this.newNoteText = '';
          this.addingNote = false;
          this.loadNotes();
        },
        error: () => {
          this.addingNote = false;
          this.snackBar.open('Failed to add note', 'Close', { duration: 3000 });
        }
      })
    );
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

  goBack(): void {
    this.router.navigate(['/leads']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
