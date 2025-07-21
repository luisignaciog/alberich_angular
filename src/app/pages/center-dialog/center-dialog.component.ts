import { CompanyService } from './../../services/company_service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { centers, CompanyData, createEmptyCompanyData } from '../../models/center_data_interface';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountryData, createEmptyCountryData } from '../../models/country_interface';
import { v4 as uuidv4 } from 'uuid';
import { MatSelectModule } from '@angular/material/select';
import { validarProductor } from '../../validators/validate_productor';
import { validarGestor } from '../../validators/validate_gestor';

@Component({
  selector: 'app-center-dialog',
  templateUrl: './center-dialog.component.html',
  styleUrl: './center-dialog.component.css',
  imports: [MatProgressSpinnerModule, FormsModule,

    ReactiveFormsModule, MatButtonModule, MatCardModule, CommonModule,
    MatInputModule, MatFormFieldModule, MatIcon, NgIf, MatSelectModule],
})
export class CenterDialogComponent {
  formulario: FormGroup;
  loading: boolean = false;
  center: centers = {} as centers;
  new: boolean = false;
  companyData: CompanyData = createEmptyCompanyData();
  cambiosPorCampo: { [nombreCampo: string]: any } = {};
  countries: CountryData = createEmptyCountryData();
  countrySelected: string = '';
  noTabla = 50111;
  camposMap = {
    Name: 3,
    Address: 5,
    City: 7,
    PhoneNo: 9,
    PostCode: 91,
    County: 92,
    EMail: 102,
    CountryRegionCode: 35,
    CodProductor: 50103,
    NIMAProductor: 999,
    CodGestor: 50104,
    NIMAGestor: 998,
    EMailEnvioServicio: 50125,
    EMailEnvioDocAmbiental: 50127,
  };

  readonly data = inject<{ center: centers }>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<CenterDialogComponent>,
    private snackBar: MatSnackBar, private session: SessionStorageService,
    private companyService: CompanyService,
    private http: HttpClient, private router: Router, private fb: FormBuilder ) {
    this.formulario = this.fb.group({
      Name: ['', [
        Validators.required,
        //Validators.maxLength(20)
      ]],
      Address: ['', [
        Validators.required,
      ]],
      City: ['', [
        Validators.required,
      ]],
      PhoneNo: ['', [
        Validators.required,
        //Validators.pattern(/^\d{10}$/)
      ]],
      PostCode: ['', [
        Validators.required,
        //Validators.pattern(/^\d{5}$/)
      ]],
      County: ['', [
        Validators.required,
      ]],
      CountryRegionCode: ['', [
        Validators.required,
      ]],
      EMail: ['', [
        Validators.required,
        Validators.email
      ]],
      CodProductor: ['', [
        // Validadores
      ]],
      NIMAProductor: ['', [
        //Validators.required,
      ]],
      CodGestor: ['', [
        //Validators.required,
      ]],
      NIMAGestor: ['', [
        //Validators.required,
      ]],
      EMailEnvioServicio: ['', [
        Validators.required,
        Validators.email
      ]],
      EMailEnvioDocAmbiental: ['', [
        Validators.required,
        Validators.email
      ]],
    }, {
      validators: [validarProductor(), validarGestor()]
    });
  }

  ngOnInit() {

    if ((this.data.center == undefined) || (this.data.center.NoEmpresaGreenBC == "")) {
      this.new = true;
      this.getCountries();
      return;
    }

    this.companyData = this.session.getData();
    this.center = this.data.center;

    this.getCountries();
    this.getChanges();
    this.setValueFields();
    this.EnableDisableCtrls();
  }

  setValueFields() {
    this.countrySelected = this.obtenerValorFinal('CountryRegionCode').valor;
    this.formulario.setValue({
      Name: this.obtenerValorFinal('Name').valor,
      Address: this.obtenerValorFinal('Address').valor,
      City: this.obtenerValorFinal('City').valor,
      PhoneNo: this.obtenerValorFinal('PhoneNo').valor,
      PostCode: this.obtenerValorFinal('PostCode').valor,
      County: this.obtenerValorFinal('County').valor,
      CountryRegionCode: this.countrySelected,
      EMail: this.obtenerValorFinal('EMail').valor,
      CodProductor: this.obtenerValorFinal('CodProductor').valor,
      NIMAProductor: this.obtenerValorFinal('NIMAProductor').valor,
      CodGestor: this.obtenerValorFinal('CodGestor').valor,
      NIMAGestor: this.obtenerValorFinal('NIMAGestor').valor,
      EMailEnvioServicio: this.obtenerValorFinal('EMailEnvioServicio').valor,
      EMailEnvioDocAmbiental: this.obtenerValorFinal('EMailEnvioDocAmbiental').valor
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  genChanges(codAgrupacion: string)
    {
      const formValues = {
        Name: this.formulario.get('Name')?.value,
        Address: this.formulario.get('Address')?.value,
        City: this.formulario.get('City')?.value,
        PhoneNo: this.formulario.get('PhoneNo')?.value,
        PostCode: this.formulario.get('PostCode')?.value,
        County: this.formulario.get('County')?.value,
        EMail: this.formulario.get('EMail')?.value,
        CountryRegionCode: this.formulario.get('CountryRegionCode')?.value,
        CodProductor: this.formulario.get('CodProductor')?.value,
        NIMAProductor: this.formulario.get('NIMAProductor')?.value,
        CodGestor: this.formulario.get('CodGestor')?.value,
        NIMAGestor: this.formulario.get('NIMAGestor')?.value,
        EMailEnvioServicio: this.formulario.get('EMailEnvioServicio')?.value,
        EMailEnvioDocAmbiental: this.formulario.get('EMailEnvioDocAmbiental')?.value,
      };

      const ahora = new Date().toISOString();
      const systemId = this.center.SystemId
      const tipoCambio = this.new ? "0" : "1"; // 0: Nuevo, 1: Modificación

      const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
        const nuevoValor = formValues[key];
        const valorAnterior = this.center[key];

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
              this.snackBar.open('No hay conexión al servidor.', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top' });

              this.loading = false;
            } else {
              this.snackBar.open('Error al llamar a la API: ' + error, 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top' });
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
      c.SystemId_Registro === this.center.SystemId
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
      valor: (this.center as any)[campo] ?? '',
      esPendiente: false
    };
  }

  tieneCambioPendiente(campo: string): boolean {
    return !!this.cambiosPorCampo[campo];
  }

  async getCountries() {
    try{
      const url = environment.url + `paisesgreenbc`;
      this.countries = await lastValueFrom(this.http.get<CountryData>(url));
    } catch (error: any) {
      if (error.status === 0) {
        this.snackBar.open('No hay conexión al servidor.', 'Cerrar', { duration: 3000, verticalPosition: 'top' });
        this.loading = false;
      } else {
        this.snackBar.open('Datos del centro no válidos', 'Cerrar', { duration: 3000, verticalPosition: 'top' });
        this.loading = false;
      }
    }
  }

  EnableDisableCtrls() {
    if (this.center.Code.trim() === "001") {
      this.formulario.get('Name')?.disable();
      this.formulario.get('Address')?.disable();
      this.formulario.get('City')?.disable();
      this.formulario.get('PhoneNo')?.disable();
      this.formulario.get('PostCode')?.disable();
      this.formulario.get('County')?.disable();
      this.formulario.get('EMail')?.disable();
      this.formulario.get('CountryRegionCode')?.disable();
      this.formulario.get('CodProductor')?.disable();
      this.formulario.get('NIMAProductor')?.disable();
      this.formulario.get('CodGestor')?.disable();
      this.formulario.get('NIMAGestor')?.disable();
      this.formulario.get('EMailEnvioServicio')?.disable();
      this.formulario.get('EMailEnvioDocAmbiental')?.disable();
    }
  }

  get hayCambiosPendientes(): boolean {
    return Object.keys(this.cambiosPorCampo).length > 0;
  }
}
