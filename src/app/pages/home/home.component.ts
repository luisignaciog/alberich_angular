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
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegistroCambio } from '../../models/registro_cambios';
import { environment } from '../../../environmets/environment';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, FormsModule,ReactiveFormsModule
    , MatInputModule, MatFormFieldModule, NgIf, MatIcon, MatButtonModule, NgClass, MatCheckboxModule]
})
export class HomeComponent {
  companyData: CompanyData = createEmptyCompanyData();
  formulario: FormGroup;
  loading: boolean = false;
  enableEdit: boolean = false;
  cambiosPorCampo: { [nombreCampo: string]: any } = {};
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
    NIMATransportista: 0,
    CertificadoTitularidadBancariaPresentado: 999,
    TarjetaNIFEmpresaPresentada: 998
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

    this.getChanges();
    this.setValueFields();
    this.EnableDisableCtrls();
  }

  setValueFields() {
    var certFile: string = 'No adjuntado';
    var nifFile: string = 'No adjuntado';
    if (this.companyData.CertificadoTitularidadBancariaPresentado) {
      certFile = 'Adjuntado';
    }

    if (this.companyData.TarjetaNIFEmpresaPresentada) {
      nifFile = 'Adjuntado';
    }

    this.formulario.setValue({
      Name: this.obtenerValorFinal('Name').valor,
      Address: this.obtenerValorFinal('Address').valor,
      City: this.obtenerValorFinal('City').valor,
      PhoneNo: this.obtenerValorFinal('PhoneNo').valor,
      PostCode: this.obtenerValorFinal('PostCode').valor,
      County: this.obtenerValorFinal('County').valor,
      VATRegistrationNo: this.obtenerValorFinal('VATRegistrationNo').valor,
      CountryRegionCode: this.obtenerValorFinal('CountryRegionCode').valor,
      MobilePhoneNo: this.obtenerValorFinal('MobilePhoneNo').valor,
      CodTransportista: this.obtenerValorFinal('CodTransportista').valor,
      NIMATransportista: this.companyData.NIMATransportista,
      CertificadoTitularidadBancariaPresentado: certFile,
      TarjetaNIFEmpresaPresentada: nifFile
    });
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
      VATRegistrationNo: this.formulario.get('VATRegistrationNo')?.value,
      CountryRegionCode: this.formulario.get('CountryRegionCode')?.value,
      MobilePhoneNo: this.formulario.get('MobilePhoneNo')?.value,
      CodTransportista: this.formulario.get('CodTransportista')?.value,
      NIMATransportista: this.formulario.get('NIMATransportista')?.value
    };

    const ahora = new Date().toISOString();
    const noTabla = 50110;
    const systemId = this.companyData.SystemId;
    const tipoCambio = '1';

    const registroscambios = (Object.keys(formValues) as (keyof typeof formValues)[]).reduce((arr, key) => {
      const nuevoValor = formValues[key];
      const valorAnterior = this.companyData[key];

      if (nuevoValor !== valorAnterior) {
        arr.push({
          FechayHora: ahora,
          NoTabla: noTabla,
          NoCampo: this.camposMap[key],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: systemId,
          SystemIdRegistroPrincipal: systemId,
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
    const body = this.genChanges(this.generarCodigoAgrupacion());

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
    this.enableEdit = false;
    this.EnableDisableCtrls();
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

    const cambios = this.companyData?.cambiosempresasgreenbc ?? [];

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

}
