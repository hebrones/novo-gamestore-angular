import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h3>{{ data.title }}</h3>
    <p>{{ data.message }}</p>
    <div style="display:flex; gap:12px; justify-content:flex-end;">
      <button (click)="close(false)">Cancelar</button>
      <button (click)="close(true)">OK</button>
    </div>
  `
})
export class ConfirmDialog {
  constructor(public ref: MatDialogRef<ConfirmDialog>, @Inject(MAT_DIALOG_DATA) public data: {title:string, message:string}) {}
  close(v:boolean){ this.ref.close(v); }
}
