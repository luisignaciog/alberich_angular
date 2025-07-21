import { CompanyService } from './../../services/company_service';
import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyData, contacts, createEmptyCompanyData } from '../../models/center_data_interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css',
  imports: [MatProgressSpinnerModule, FormsModule, CommonModule,
    ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatInputModule, MatFormFieldModule, MatIcon, NgIf],

})
export class ContactDialogComponent {
  formulario: FormGroup;
  loading: boolean = false;
  contact: contacts = {} as contacts;
  new: boolean = false;
  companyData: CompanyData = createEmptyCompanyData();
  cambiosPorCampo: { [nombreCampo: string]: any } = {};
  noTabla = 5050;
  camposMap = {
    Name: 2,
    Name2: 4,
    PhoneNo: 9,
    EMail: 102
  };

  readonly data = inject<{ contact: contacts }>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    private snackBar: MatSnackBar,
    private session: SessionStorageService,
    private companyService: CompanyService,
    private http: HttpClient, private router: Router, private fb: FormBuilder ) {
    this.formulario = this.fb.group({
      Name: ['', [
        Validators.required,
        //Validators.maxLength(20)
      ]],
      Name2: ['', [
        //Validators.required,
      ]],
      PhoneNo: ['', [
        Validators.required,
        //Validators.pattern(/^\d{10}$/)
      ]],
      EMail: ['', [
        Validators.required,
        Validators.email
      ]]
    });

  }

  ngOnInit() {
    if (this.data.contact === undefined) {
      this.new = true;
      return;
    }

    this.companyData = this.session.getData();
    this.contact = this.data.contact;

    this.getChanges();
    this.setValueFields();
  }

  setValueFields() {
    this.formulario.setValue({
      Name: this.obtenerValorFinal('Name').valor,
      Name2: this.obtenerValorFinal('Name2').valor,
      PhoneNo: this.obtenerValorFinal('PhoneNo').valor,
      EMail: this.obtenerValorFinal('EMail').valor
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  genChanges(codAgrupacion: string)
    {
      const formValues = {
        Name: this.formulario.get('Name')?.value,
        Name2: this.formulario.get('Name2')?.value,
        PhoneNo: this.formulario.get('PhoneNo')?.value,
        EMail: this.formulario.get('EMail')?.value
      };

      const ahora = new Date().toISOString();
      const systemId = this.contact.SystemId
      const tipoCambio = this.new ? "0" : "1"; // 0: Nuevo, 1: Modificación

      const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
      const nuevoValor = formValues[key];
      const valorAnterior = this.contact[key];

      if (nuevoValor !== valorAnterior) {
        arr.push({
          FechayHora: ahora,
          NoTabla: this.noTabla,
          NoCampo: this.camposMap[key],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: systemId,
          SystemIdRegistroPrincipal: this.companyData.SystemId,
          TipodeCambio: tipoCambio,
          CodAgrupacionCambios: codAgrupacion
        });
      }

      return arr;
    }, [] as RegistroCambio[]);

    const payload = { registroscambios };
    return payload;
  }

  async save() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // marca campos para mostrar errores
      this.snackBar.open('Por favor completa los campos obligatorios.', 'Cerrar', { duration: 4000, verticalPosition: 'top' });
      return;
    }

    const body = this.genChanges(this.generarCodigoAgrupacion());
    if (body.registroscambios.length === 0) {
      this.dialogRef.close(false);
      return;
    }

    try{
      this.loading = true;
      const url = environment.url + "registroscambiosHeader?$expand=registroscambios";
      const result = await firstValueFrom(this.http.post(url, body));
      this.loading = false;

      this.snackBar.open('Datos pendientes de revisión', 'Cerrar', { duration: 4000, verticalPosition: 'top' });
      this.dialogRef.close(false);
      this.companyService.refreshCompanyData(this.companyData.SystemId, true);

    } catch (error: any) {
      if (error.status === 0) {
        this.snackBar.open('No hay conexión al servidor.', 'Cerrar', { duration: 4000, verticalPosition: 'top' });
        this.loading = false;
      } else {
        this.snackBar.open('Error al llamar al API: ' + error.error?.error?.message, 'Cerrar', { duration: 4000, verticalPosition: 'top' });
        this.loading = false;
      }
    }
  }

  generarCodigoAgrupacion(): string {
    const ahora = new Date();
    const fechaHora = ahora.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // "20250715T142012"
    const uuid = uuidv4().replace(/-/g, '').slice(0, 8); // "8f3c9c2e"
    return `${fechaHora}-${uuid}`; // Total: 23 caracteres
  }

  getChanges() {
    const campoPorNumero: { [noCampo: number]: string } = {};
    Object.entries(this.camposMap).forEach(([nombre, numero]) => {
      campoPorNumero[numero] = nombre;
    });

    const cambios = (this.companyData?.cambiosempresasgreenbc ?? []).filter(
      c =>
      c.No_Tabla === this.noTabla &&
      c.Tipo_de_Cambio === 'Modification' &&
      c.SystemId_Registro === this.contact.SystemId
    );


    for (const cambio of cambios) {
      const nombreCampo = campoPorNumero[cambio.No_Campo];
      if (!nombreCampo) continue;

      if (
        !this.cambiosPorCampo[nombreCampo] ||
        cambio.No_Mov > this.cambiosPorCampo[nombreCampo].No_Mov
      ) {
        this.cambiosPorCampo[nombreCampo] = cambio;
      }
    }
  }

  obtenerValorFinal(campo: string): { valor: string, esPendiente: boolean } {
    if (this.cambiosPorCampo[campo]) {
      return {
        valor: this.cambiosPorCampo[campo].Valor_Nuevo ?? '',
        esPendiente: true
      };
    }
    return {
      valor: (this.contact as any)[campo] ?? '',
      esPendiente: false
    };
  }

  tieneCambioPendiente(campo: string): boolean {
    return !!this.cambiosPorCampo[campo];
  }

  get hayCambiosPendientes(): boolean {
    return Object.keys(this.cambiosPorCampo).length > 0;
  }
}
