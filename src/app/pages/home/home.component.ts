import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { SessionStorageService } from '../../models/session-storage-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyData, createEmptyCompanyData } from '../../models/center_data_interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CountryData, createEmptyCountryData } from '../../models/country_interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, FormsModule,ReactiveFormsModule, CommonModule
    , MatInputModule, MatFormFieldModule, NgIf, MatIcon, MatButtonModule, NgClass, MatCheckboxModule, MatSelectModule]
})
export class HomeComponent {
  companyData: CompanyData = createEmptyCompanyData();
  formulario: FormGroup;
  loading: boolean = false;
  enableEdit: boolean = false;
  cambiosPorCampo: { [nombreCampo: string]: any } = {};
  ficherosBase64: { [key: string]: string } = {};
  countries: CountryData = createEmptyCountryData();
  countrySelected: string = '';
  noTabla = 50110;
  camposMap = {
    Name: 2,
    Address: 5,
    City: 7,
    PhoneNo: 9,
    PostCode: 91,
    County: 92,
    VATRegistrationNo: 86,
    CountryRegionCode: 35,
    MobilePhoneNo: 5061,
    CodTransportista: 50105,
    NIMATransportista: 999,
    CertificadoTitularidadBancariaPresentado: 998,
    TarjetaNIFEmpresaPresentada: 997
  };

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService,
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
      MobilePhoneNo: ['', [
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
      CountryRegionCode: ['', [
        //Validators.required,
      ]],
      VATRegistrationNo: ['', [
        //Validators.required,
      ]],
      CodTransportista: ['', [
        //Validators.required,
      ]],
      NIMATransportista: ['', [
        //Validators.required,
      ]],
      CertificadoTitularidadBancariaPresentado: ['', [
        //Validators.required,
      ]],
      TarjetaNIFEmpresaPresentada: ['', [
        //Validators.required,
      ]],
    });
  }

  ngOnInit() {
    this.companyData = this.session.getData();

    if (this.companyData === null) {
      this.router.navigate(['login']);
    }

    this.getCountries();
    this.getChanges();
    this.setValueFields();
    this.EnableDisableCtrls();
  }

  setValueFields() {
    var certFile: string = this.obtenerValorFinal('CertificadoTitularidadBancariaPresentado').valor;
    if (certFile === 'false') { certFile = ''; }
    var nifFile: string = this.obtenerValorFinal('TarjetaNIFEmpresaPresentada').valor;
    if (nifFile === 'false') { nifFile = ''; }

    this.countrySelected = this.obtenerValorFinal('CountryRegionCode').valor;
    this.formulario.setValue({
      Name: this.obtenerValorFinal('Name').valor,
      Address: this.obtenerValorFinal('Address').valor,
      City: this.obtenerValorFinal('City').valor,
      PhoneNo: this.obtenerValorFinal('PhoneNo').valor,
      PostCode: this.obtenerValorFinal('PostCode').valor,
      County: this.obtenerValorFinal('County').valor,
      VATRegistrationNo: this.obtenerValorFinal('VATRegistrationNo').valor,
      CountryRegionCode: this.countrySelected,
      MobilePhoneNo: this.obtenerValorFinal('MobilePhoneNo').valor,
      CodTransportista: this.obtenerValorFinal('CodTransportista').valor,
      NIMATransportista: this.companyData.NIMATransportista,
      CertificadoTitularidadBancariaPresentado: certFile,
      TarjetaNIFEmpresaPresentada: nifFile
    });
  }

  genChanges(codAgrupacion: string) {
    var certFile: any = false;
    var nifFile: any = false;
    if (this.formulario.get('CertificadoTitularidadBancariaPresentado')?.value != '') { certFile = this.formulario.get('CertificadoTitularidadBancariaPresentado')?.value }
    if (this.formulario.get('TarjetaNIFEmpresaPresentada')?.value != '') { nifFile = this.formulario.get('TarjetaNIFEmpresaPresentada')?.value }

    const formValues = {
      Name: this.formulario.get('Name')?.value,
      Address: this.formulario.get('Address')?.value,
      City: this.formulario.get('City')?.value,
      PhoneNo: this.formulario.get('PhoneNo')?.value,
      PostCode: this.formulario.get('PostCode')?.value,
      County: this.formulario.get('County')?.value,
      VATRegistrationNo: this.formulario.get('VATRegistrationNo')?.value,
      CountryRegionCode: this.formulario.get('CountryRegionCode')?.value,
      MobilePhoneNo: this.formulario.get('MobilePhoneNo')?.value,
      CodTransportista: this.formulario.get('CodTransportista')?.value,
      NIMATransportista: this.formulario.get('NIMATransportista')?.value,
      CertificadoTitularidadBancariaPresentado: certFile,
      TarjetaNIFEmpresaPresentada: nifFile
    };

    const ahora = new Date().toISOString();
    const noTabla = this.noTabla;
    const systemId = this.companyData.SystemId;
    const tipoCambio = '1';

    const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
      const nuevoValor = formValues[key];
      const valorAnterior = this.companyData[key];

      const hayCambio = nuevoValor !== valorAnterior;

      const tieneFicheroBase64 = this.ficherosBase64?.[key];

      if (hayCambio || tieneFicheroBase64) {
        const registro: any = {
          FechayHora: ahora,
          NoTabla: noTabla,
          NoCampo: this.camposMap[key],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: systemId,
          SystemIdRegistroPrincipal: systemId,
          TipodeCambio: tipoCambio,
          CodAgrupacionCambios: codAgrupacion
        };

        if (tieneFicheroBase64) {
          registro.FicheroCargado = this.ficherosBase64[key];
        }

        arr.push(registro);
      }

      return arr;
    }, [] as RegistroCambio[]);

    return { registroscambios };
  }


  async save() {
    const body = this.genChanges(this.generarCodigoAgrupacion());

    try{
      this.loading = true;
      const url = environment.url + "registroscambiosHeader?$expand=registroscambios";
      const result = await firstValueFrom(this.http.post(url, body));
      this.loading = false;

      this.snackBar.open('Datos guardados', 'Cerrar', { duration: 3000, verticalPosition: 'top' });
      this.enableEdit = false;
      this.EnableDisableCtrls();

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

  toPascalCase(camelCase: string): string {
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  cancel() {
    this.enableEdit = false;
    this.EnableDisableCtrls();
  }

  EnableDisableCtrls() {
    if (this.enableEdit) {
      this.formulario.get('Name')?.enable();
      this.formulario.get('Address')?.enable();
      this.formulario.get('City')?.enable();
      this.formulario.get('PhoneNo')?.enable();
      this.formulario.get('PostCode')?.enable();
      this.formulario.get('County')?.enable();
      this.formulario.get('VATRegistrationNo')?.enable();
      this.formulario.get('CodTransportista')?.enable();
      this.formulario.get('NIMATransportista')?.enable();
      this.formulario.get('CountryRegionCode')?.enable();
      this.formulario.get('MobilePhoneNo')?.enable();
      this.formulario.get('CertificadoTitularidadBancariaPresentado')?.enable();
      this.formulario.get('TarjetaNIFEmpresaPresentada')?.enable();
    } else {
      this.formulario.get('Name')?.disable();
      this.formulario.get('Address')?.disable();
      this.formulario.get('City')?.disable();
      this.formulario.get('PhoneNo')?.disable();
      this.formulario.get('PostCode')?.disable();
      this.formulario.get('County')?.disable();
      this.formulario.get('VATRegistrationNo')?.disable();
      this.formulario.get('CodTransportista')?.disable();
      this.formulario.get('NIMATransportista')?.disable();
      this.formulario.get('CountryRegionCode')?.disable();
      this.formulario.get('MobilePhoneNo')?.disable();
      this.formulario.get('CertificadoTitularidadBancariaPresentado')?.disable();
      this.formulario.get('TarjetaNIFEmpresaPresentada')?.disable();
    }
  }

  edit() {
    this.enableEdit = !this.enableEdit;
    this.EnableDisableCtrls();
  }

  centers() {
    console.log('centers');
    this.router.navigate(['centers']);
  }

  contacts() {
    console.log('contacts');
    this.router.navigate(['contacts']);
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
      c => c.No_Tabla === this.noTabla
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
        valor: this.cambiosPorCampo[campo].Valor_Nuevo,
        esPendiente: true
      };
    }
    return {
      valor: (this.companyData as any)[campo],
      esPendiente: false
    };
  }

  tieneCambioPendiente(campo: string): boolean {
      return !!this.cambiosPorCampo[campo];
    }

    adjuntarArchivo(campo: string, input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file) return;

    // Validaciones
    const tipoPermitido = ['application/pdf', 'image/png', 'image/jpeg'];
    const maxSizeBytes = 4 * 1024 * 1024; // 5 MB

    if (!tipoPermitido.includes(file.type)) {
      this.snackBar.open('Tipo de archivo no permitido. Solo PDF, PNG o JPG.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (file.size > maxSizeBytes) {
      this.snackBar.open('El archivo supera el tamaño máximo de 4 MB.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      // Guarda el nombre visible
      this.formulario.get(campo)?.setValue(file.name);

      // Guarda el base64 vinculado al campo
      this.ficherosBase64[campo] = base64;
    };

    reader.readAsDataURL(file);
  }

  async getCountries()
  {
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
}
