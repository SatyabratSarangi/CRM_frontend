import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LeadTypeService } from '../../services/lead-type.service';
import { LeadType } from '../../models/lead-type.model';
import { LeadTypeDialogComponent } from '../lead-type-dialog/lead-type-dialog.component';

@Component({
  selector: 'app-lead-types',
  templateUrl: './lead-types.component.html',
  styleUrls: ['./lead-types.component.css']
})
export class LeadTypesComponent implements OnInit, OnDestroy {
  leadTypes: LeadType[] = [];
  displayedColumns = ['id', 'name', 'description', 'actions'];
  loading = true;
  private subs = new Subscription();

  constructor(
    private leadTypeService: LeadTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLeadTypes();
  }

  loadLeadTypes(): void {
    this.loading = true;
    this.subs.add(
      this.leadTypeService.getAll().subscribe({
        next: (data) => {
          this.leadTypes = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to load lead types', 'Close', { duration: 3000 });
        }
      })
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(LeadTypeDialogComponent, {
      width: '480px',
      data: { mode: 'add' },
      panelClass: 'custom-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadLeadTypes();
      })
    );
  }

  openEditDialog(leadType: LeadType): void {
    const dialogRef = this.dialog.open(LeadTypeDialogComponent, {
      width: '480px',
      data: { mode: 'edit', leadType: { ...leadType } },
      panelClass: 'custom-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadLeadTypes();
      })
    );
  }

  deleteLeadType(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.subs.add(
        this.leadTypeService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Lead type deleted successfully', 'Close', { duration: 2000 });
            this.loadLeadTypes();
          },
          error: () => {
            this.snackBar.open('Failed to delete lead type', 'Close', { duration: 3000 });
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
