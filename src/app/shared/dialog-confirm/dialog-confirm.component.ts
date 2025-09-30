import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

export interface DialogData {
    title?: string;
    message: string;
    showIcon?: boolean;
    buttonCancelTitle?: string;
    buttonConfirmTitle?: string;
    params?: { [key: string]: any };
}

@Component({
    standalone: true,
    selector: 'app-confirm-dialog',
    templateUrl: './dialog-confirm.component.html',
    styleUrls: ['./dialog-confirm.component.css'],
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    showTitle: boolean = false;
    showIcon: boolean = false;
    buttonCancelTitle: string = '';
    buttonConfirmTitle: string = '';

  ngOnInit(){
    if (this.data.title) {
        this.showTitle = true;
    }
    this.showIcon = false;
    if (this.data.showIcon) {
        this.showIcon = true;
    }

    console.log('Dialog data:', this.data);

    if (this.data.buttonCancelTitle) {
        this.buttonCancelTitle = this.data.buttonCancelTitle;
    } else {
        this.buttonCancelTitle = 'Cancelar';
    }

    if (this.data.buttonConfirmTitle) {
        this.buttonConfirmTitle = this.data.buttonConfirmTitle;
    } else {
        this.buttonConfirmTitle = 'Aceptar';
    }
  }

  onConfirm(): void {
      this.dialogRef.close(true);
  }

  onCancel(): void {
      this.dialogRef.close(false);
  }
}
