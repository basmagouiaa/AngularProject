import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CategorieDialogData {
  id?: number;
  name: string;
}

@Component({
  selector: 'app-categorie-dialog-data',
  templateUrl: './categorie-dialog-data.component.html',
  styleUrls: ['./categorie-dialog-data.component.css']
})
export class CategorieDialogDataComponent {
  categorieForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategorieDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategorieDialogData
  ) {
    this.isEditMode = !!data;
    this.categorieForm = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    
    if (this.categorieForm.valid) {
      this.dialogRef.close(this.categorieForm.value);
    }
  }
}
