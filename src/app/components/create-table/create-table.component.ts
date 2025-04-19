import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablesService } from 'src/services/tables.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
  
})
export class CreateTableComponent implements OnInit {
  tableForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private tablesService: TablesService,
    public dialogRef: MatDialogRef<CreateTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, number: number, capacity: number, availability: boolean }
  ) {
    this.tableForm = this.fb.group({
      id: [null],
      number: ['', [Validators.required, Validators.min(1)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      availability: [true, Validators.required]
    });

    if (data) {
      this.isEditMode = true;
      this.tableForm.patchValue(data);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.tableForm.valid) {
      const table = { ...this.tableForm.value };
      if (!this.isEditMode) {
        delete table.id;
      }
      if (this.isEditMode) {
        this.tablesService.updateTable(table).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error updating table:', err)
        });
      } else {
        this.tablesService.addTable(table).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error adding table:', err)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
