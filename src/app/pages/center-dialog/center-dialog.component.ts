import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { centers, CompanyData, createEmptyCompanyData } from '../../models/center_data_interface';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-center-dialog',
  templateUrl: './center-dialog.component.html',
  styleUrl: './center-dialog.component.css',
  imports: [MatProgressSpinnerModule, FormsModule,

    ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatInputModule, MatFormFieldModule, MatIcon, NgIf],
})
export class CenterDialogComponent {
  formulario: FormGroup;
  loading: boolean = false;
  center: centers = {} as centers;
  new: boolean = false;
  companyData: CompanyData = createEmptyCompanyData();

  readonly data = inject<{ center: centers }>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<CenterDialogComponent>,
    private snackBar: MatSnackBar, private session: SessionStorageService,
    private http: HttpClient, private router: Router, private fb: FormBuilder ) {
    this.formulario = this.fb.group({
      Name: ['', [
        //Validators.required,
        //Validators.maxLength(20)
      ]],
      Address: ['', [
        //Validators.required,
      ]],
      City: ['', [
        //Validators.required,
      ]],
      PhoneNo: ['', [
        //Validators.required,
        //Validators.pattern(/^\d{10}$/)
      ]],
      PostCode: ['', [
        //Validators.required,
        //Validators.pattern(/^\d{5}$/)
      ]],
      County: ['', [
        //Validators.required,
      ]],
      EMail: ['', [
        //Validators.required,
        //Validators.email
      ]],
      EMailEnvioServicio: ['', [
        //Validators.required,
        //Validators.email
      ]],
      EMailEnvioDocAmbiental: ['', [
        //Validators.required,
        //Validators.email
      ]],
    });
  }

  ngOnInit() {

    if ((this.data.center == undefined) || (this.data.center.NoEmpresaGreenBC == "")) {
      this.new = true;
      return;
    }

  this.companyData = this.session.getData();

  this.center = this.data.center;

  this.formulario.setValue({
    Name: this.center.Name || '',
    Address: this.center.Address || '',
    City: this.center.City || '',
    PhoneNo: this.center.PhoneNo || '',
    PostCode: this.center.PostCode || '',
    County: this.center.County || '',
    EMail: this.center.EMail || '',
    EMailEnvioServicio: this.center.EMailEnvioServicio || '',
    EMailEnvioDocAmbiental: this.center.EMailEnvioDocAmbiental || '',
  });
}

  cancel() {
    this.dialogRef.close(false);
  }

  genChanges()
    {
      const formValues = {
        Name: this.formulario.get('Name')?.value,
        Address: this.formulario.get('Address')?.value,
        City: this.formulario.get('City')?.value,
        PhoneNo: this.formulario.get('PhoneNo')?.value,
        PostCode: this.formulario.get('PostCode')?.value,
        County: this.formulario.get('County')?.value,
        EMail: this.formulario.get('EMail')?.value,
        EMailEnvioServicio: this.formulario.get('EMailEnvioServicio')?.value,
        EMailEnvioDocAmbiental: this.formulario.get('EMailEnvioDocAmbiental')?.value,
      };

      const camposMap = {
        Name: 3,
        Address: 5,
        City: 7,
        PhoneNo: 9,
        PostCode: 91,
        County: 92,
        EMail: 102,
        EMailEnvioServicio: 50125,
        EMailEnvioDocAmbiental: 50127,
      };

      const ahora = new Date().toISOString();
      const noTabla = 50111;
      const systemId = this.center.SystemId
      const tipoCambio = this.new ? "0" : "1"; // 0: Nuevo, 1: Modificación

      const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
        const nuevoValor = formValues[key];
        const valorAnterior = this.center[key];

        if (nuevoValor !== valorAnterior) {
          arr.push({
            FechayHora: ahora,
            NoTabla: noTabla,
            NoCampo: camposMap[key],
            ValorNuevo: String(nuevoValor),
            SystemIdRegistro: systemId,
            SystemIdRegistroPrincipal: this.companyData.SystemId,
            TipodeCambio: tipoCambio,
            CodAgrupacionCambios: ahora
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
