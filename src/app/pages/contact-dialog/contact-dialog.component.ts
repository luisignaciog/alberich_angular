import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { contacts } from '../../models/center_data_interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css',
  imports: [MatProgressSpinnerModule, FormsModule,
    ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatInputModule, MatFormFieldModule, MatIcon, NgIf],

})
export class ContactDialogComponent {
  formulario: FormGroup;
  loading: boolean = false;
  contact: contacts = {} as contacts;
  new: boolean = false;

  readonly data = inject<{ contact: contacts }>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    private snackBar: MatSnackBar,
    private session: SessionStorageService,
    private http: HttpClient, private router: Router, private fb: FormBuilder ) {
    this.formulario = this.fb.group({
      Name: ['', [
        //Validators.required,
        //Validators.maxLength(20)
      ]],
      Name2: ['', [
        //Validators.required,
      ]],
      PhoneNo: ['', [
        //Validators.required,
        //Validators.pattern(/^\d{10}$/)
      ]],
      EMail: ['', [
        //Validators.required,
        //Validators.email
      ]]
    });

  }

  ngOnInit() {
    if (this.data.contact === undefined) {
      this.new = true;
      return;
    }

    this.contact = this.data.contact;
    this.formulario.setValue({
      Name: this.contact.Name,
      Name2: this.contact.Name2,
      PhoneNo: this.contact.PhoneNo,
      EMail: this.contact.EMail
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  genChanges()
    {
      const formValues = {
        Name: this.formulario.get('Name')?.value,
        Name2: this.formulario.get('Name2')?.value,
        PhoneNo: this.formulario.get('PhoneNo')?.value,
        EMail: this.formulario.get('EMail')?.value
      };

      const camposMap = {
        Name: 2,
        Name2: 4,
        PhoneNo: 9,
        EMail: 102
      };

      const ahora = new Date().toISOString();
      const noTabla = 5050;
      const systemId = this.contact.SystemId
      const tipoCambio = this.new ? "0" : "1"; // 0: Nuevo, 1: Modificación

      const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
      const nuevoValor = formValues[key];
      const valorAnterior = this.contact[key];

      if (nuevoValor !== valorAnterior) {
        arr.push({
          FechayHora: ahora,
          NoTabla: noTabla,
          NoCampo: camposMap[key],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: systemId,
          TipodeCambio: tipoCambio
        });
      }

      return arr;
    }, [] as RegistroCambio[]);

    const payload = { registroscambios };
    return payload;
    }

    async save() {
      const body = this.genChanges();
      if (body.registroscambios.length === 0) {
        this.dialogRef.close(false);
        return;
      }

      try{
            this.loading = true;
            const url = environment.url + "registroscambiosHeader?$expand=registroscambios";
            const result = await firstValueFrom(this.http.post(url, body));
            this.loading = false;
                      } catch (error: any) {
            if (error.status === 0) {
              this.snackBar.open('No hay conexión al servidor.', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top' });

              this.loading = false;
            } else {
              this.snackBar.open('Error al llamar al API: ' + error, 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top' });
              this.loading = false;
            }
          }

      this.snackBar.open('Datos guardados', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top' });
      this.dialogRef.close(false);
    }
}
