import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FollowUpService } from '../../services/follow-up.service';
import { LEAD_STATUSES } from '../../models/customer-lead.model';

@Component({
  selector: 'app-follow-up-dialog',
  templateUrl: './follow-up-dialog.component.html',
  styleUrls: ['./follow-up-dialog.component.css']
})
export class FollowUpDialogComponent implements OnDestroy {
  form: FormGroup;
  statuses = LEAD_STATUSES;
  loading = false;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private followUpService: FollowUpService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FollowUpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { leadId: number }
  ) {
    this.form = this.fb.group({
      followUpDate: [new Date(), Validators.required],
      notes: [''],
      status: [''],
      nextFollowUpDate: ['']
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const followUp = this.form.value;
    this.subs.add(
      this.followUpService.create(this.data.leadId, followUp).subscribe({
        next: () => {
          this.snackBar.open('Follow-up added successfully', 'Close', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to add follow-up', 'Close', { duration: 3000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
