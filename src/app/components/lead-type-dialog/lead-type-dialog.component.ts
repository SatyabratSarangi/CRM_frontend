import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LeadTypeService } from '../../services/lead-type.service';
import { LeadType } from '../../models/lead-type.model';

@Component({
  selector: 'app-lead-type-dialog',
  templateUrl: './lead-type-dialog.component.html',
  styleUrls: ['./lead-type-dialog.component.css']
})
export class LeadTypeDialogComponent implements OnDestroy {
  form: FormGroup;
  isEdit: boolean;
  loading = false;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private leadTypeService: LeadTypeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LeadTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; leadType?: LeadType }
  ) {
    this.isEdit = data.mode === 'edit';
    this.form = this.fb.group({
      name: [data.leadType?.name || '', Validators.required],
      description: [data.leadType?.description || '']
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const leadType: LeadType = this.form.value;

    if (this.isEdit && this.data.leadType?.id) {
      this.subs.add(
        this.leadTypeService.update(this.data.leadType.id, leadType).subscribe({
          next: () => {
            this.snackBar.open('Lead type updated successfully', 'Close', { duration: 2000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
            this.snackBar.open('Failed to update lead type', 'Close', { duration: 3000 });
          }
        })
      );
    } else {
      this.subs.add(
        this.leadTypeService.create(leadType).subscribe({
          next: () => {
            this.snackBar.open('Lead type created successfully', 'Close', { duration: 2000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
            this.snackBar.open('Failed to create lead type', 'Close', { duration: 3000 });
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
