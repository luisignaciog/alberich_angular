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
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, FormsModule,ReactiveFormsModule
    , MatInputModule, MatFormFieldModule, NgIf, MatIcon, MatButtonModule]
})
export class HomeComponent {
  companyData: CompanyData = createEmptyCompanyData();
  formulario: FormGroup;
  loading: boolean = false;
  enableEdit: boolean = false;

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
      ShippingAgentCode: ['', [
        //Validators.required,
      ]],
      ShippingAgentNIMA: ['', [
        //Validators.required,
      ]],
      BankOwnershipCertificate: ['', [
        //Validators.required,
      ]]
    });
  }

  ngOnInit() {
    this.companyData = this.session.getData();

    if (this.companyData === null) {
      this.router.navigate(['login']);
    }

    this.formulario.setValue({
      Name: this.companyData.Name,
      Address: this.companyData.Address,
      City: this.companyData.City,
      PhoneNo: this.companyData.PhoneNo,
      PostCode: this.companyData.PostCode,
      County: this.companyData.County,
      VATRegistrationNo: this.companyData.VATRegistrationNo,
      ShippingAgentCode: '',
      ShippingAgentNIMA: '',
      CountryRegionCode: this.companyData.CountryRegionCode,
      MobilePhoneNo: this.companyData.MobilePhoneNo,
      BankOwnershipCertificate: ''
    });

    this.EnableDisableCtrls();
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
      VATRegistrationNo: this.formulario.get('VATRegistrationNo')?.value,
      CountryRegionCode: this.formulario.get('CountryRegionCode')?.value,
      MobilePhoneNo: this.formulario.get('MobilePhoneNo')?.value,
    };

    const camposMap = {
      Name: 2,
      Address: 5,
      City: 7,
      PhoneNo: 9,
      PostCode: 91,
      County: 92,
      VATRegistrationNo: 86,
      CountryRegionCode: 35,
      MobilePhoneNo: 5061,
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
          NoCampo: camposMap[key],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: systemId,
          SystemIdRegistroPrincipal: systemId,
          TipodeCambio: tipoCambio,
          CodAgrupacionCambios: this.toPascalCase(key) // Assuming CodAgrupacionCambios is derived from the key
        });
      }

      return arr;
    }, [] as RegistroCambio[]);

    const payload = { registroscambios };
    return payload;
  }

  async save() {
    const body = this.genChanges();

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
      this.formulario.get('ShippingAgentCode')?.enable();
      this.formulario.get('ShippingAgentNIMA')?.enable();
      this.formulario.get('CountryRegionCode')?.enable();
      this.formulario.get('MobilePhoneNo')?.enable();
      this.formulario.get('BankOwnershipCertificate')?.enable();
    } else {
      this.formulario.get('Name')?.disable();
      this.formulario.get('Address')?.disable();
      this.formulario.get('City')?.disable();
      this.formulario.get('PhoneNo')?.disable();
      this.formulario.get('PostCode')?.disable();
      this.formulario.get('County')?.disable();
      this.formulario.get('VATRegistrationNo')?.disable();
      this.formulario.get('ShippingAgentCode')?.disable();
      this.formulario.get('ShippingAgentNIMA')?.disable();
      this.formulario.get('CountryRegionCode')?.disable();
      this.formulario.get('MobilePhoneNo')?.disable();
      this.formulario.get('BankOwnershipCertificate')?.disable();
    }
  }

  edit() {
    this.enableEdit = !this.enableEdit;
    this.EnableDisableCtrls();
  }

  generateRegistrosCambios(formValues: any, camposMap: { [key: string]: number }, noTabla: number, systemId: string, tipoCambio: string = '1'): { registroscambios: RegistroCambio[] } {
  const ahora = new Date().toISOString();

  const registroscambios: RegistroCambio[] = Object.keys(formValues).map(key => ({
      FechayHora: ahora,
      NoTabla: noTabla,
      NoCampo: camposMap[key],
      ValorNuevo: String(formValues[key]),
      SystemIdRegistro: systemId,
      SystemIdRegistroPrincipal: systemId,
      CodAgrupacionCambios: this.toPascalCase(key),
      TipodeCambio: tipoCambio
    }));

    return { registroscambios };
  }

  centers() {
    console.log('centers');
    this.router.navigate(['centers']);
  }

  contacts() {
    console.log('contacts');
    this.router.navigate(['contacts']);
  }

}
