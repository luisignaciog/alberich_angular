import { CompanyService } from './../../services/company_service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
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
import { validarShippingAgent } from '../../validators/validate_shipping_agent';
import { validarProductor } from '../../validators/validate_productor';
import { alMenosUnoRequerido, validarGestor } from '../../validators/validate_gestor';

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
    EMail: 102,
    VATRegistrationNo: 86,
    CountryRegionCode: 35,
    MobilePhoneNo: 5061,
    CodTransportista: 50105,
    NIMATransportista: 999,
    CertificadoTitularidadBancariaPresentado: 998,
    TarjetaNIFEmpresaPresentada: 997,

    // Campos especiales del centro 001:
    CodProductor: 50103,
    NIMAProductor: 999,
    CodGestor: 50104,
    NIMAGestor: 998,
    EMailEnvioServicio: 50125,
    EMailEnvioDocAmbiental: 50127,
  };

  campoTablaMap: { [campo: string]: number } = {
    Name: 50110,
    Address: 50110,
    PhoneNo: 50110,
    City: 50110,
    PostCode: 50110,
    County: 50110,
    EMail: 50110,
    CountryRegionCode: 50110,
    VATRegistrationNo: 50110,
    MobilePhoneNo: 50110,
    CodTransportista: 50110,
    NIMATransportista: 50110,
    CertificadoTitularidadBancariaPresentado: 50110,
    TarjetaNIFEmpresaPresentada: 50110,

    // Campos especiales del centro 001:
    CodProductor: 50111,
    NIMAProductor: 50111,
    CodGestor: 50111,
    NIMAGestor: 50111,
    EMailEnvioServicio: 50111,
    EMailEnvioDocAmbiental: 50111
  };

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService,
    private http: HttpClient, private router: Router, private fb: FormBuilder,
    private companyService: CompanyService) {
    this.formulario = this.fb.group({
      Name: ['', [ Validators.required ]],
      Address: ['', [ Validators.required ]],
      City: ['', [ Validators.required ]],
      PhoneNo: ['', [ Validators.required ]],
      MobilePhoneNo: ['', [ Validators.required ]],
      PostCode: ['', [ Validators.required ]],
      County: ['', [ Validators.required ]],
      EMail: ['', [ Validators.required, Validators.email ]],
      CountryRegionCode: ['', [ Validators.required ]],
      VATRegistrationNo: ['', [ Validators.required ]],
      CodTransportista: ['', [ ]],
      NIMATransportista: ['', [ ]],
      CertificadoTitularidadBancariaPresentado: ['', [ ]],
      TarjetaNIFEmpresaPresentada: ['', [ ]],
      CodProductor: ['', [ ]],
      NIMAProductor: ['', [ ]],
      CodGestor: ['', [ ]],
      NIMAGestor: ['', [ ]],
      EMailEnvioServicio: ['', [ Validators.required, Validators.email ]],
      EMailEnvioDocAmbiental: ['', [ Validators.required, Validators.email ]],
    }, {
        validators: [
          validarShippingAgent(),
          validarProductor(),
          validarGestor(),
          alMenosUnoRequerido('CodProductor', 'CodGestor') // <-- Aquí lo añades
      ]
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
      EMail: this.obtenerValorFinal('EMail').valor,
      VATRegistrationNo: this.obtenerValorFinal('VATRegistrationNo').valor,
      CountryRegionCode: this.countrySelected,
      MobilePhoneNo: this.obtenerValorFinal('MobilePhoneNo').valor,
      CodTransportista: this.obtenerValorFinal('CodTransportista').valor,
      NIMATransportista: this.companyData.NIMATransportista,
      CertificadoTitularidadBancariaPresentado: certFile,
      TarjetaNIFEmpresaPresentada: nifFile,
      CodProductor: this.obtenerValorFinal('CodProductor').valor,
      NIMAProductor: this.obtenerValorFinal('NIMAProductor').valor,
      CodGestor: this.obtenerValorFinal('CodGestor').valor,
      NIMAGestor: this.obtenerValorFinal('NIMAGestor').valor,
      EMailEnvioServicio: this.obtenerValorFinal('EMailEnvioServicio').valor,
      EMailEnvioDocAmbiental: this.obtenerValorFinal('EMailEnvioDocAmbiental').valor,
    });
  }

  genChanges(codAgrupacion: string) {
    const ahora = new Date().toISOString();
    const systemId = this.companyData.SystemId;
    const tipoCambio = '1'; // Modification

    const camposFormulario = this.formulario.value;

    const centro001 = this.companyData.centrosempresasgreenbc.find(c => c.Code === '001');
    const systemIdCentro001 = centro001?.SystemId;
    const camposFichero = ['CertificadoTitularidadBancariaPresentado', 'TarjetaNIFEmpresaPresentada'];


    // Función para saber a qué tabla pertenece un campo
    const obtenerTablaParaCampo = (campo: string): number => {
      const camposCentro001 = [
        'CodProductor', 'NIMAProductor', 'CodGestor',
        'NIMAGestor', 'EMailEnvioServicio', 'EMailEnvioDocAmbiental'
      ];
      return camposCentro001.includes(campo) ? 50111 : this.noTabla;
    };

    const registroscambios = Object.keys(camposFormulario).reduce((arr, key) => {
      const nuevoValor = camposFormulario[key];
      const tabla = obtenerTablaParaCampo(key);
      const valorAnterior =
        tabla === 50111
          ? centro001?.[key as keyof typeof centro001]
          : this.companyData?.[key as keyof typeof this.companyData];

      const hayCambio = nuevoValor !== valorAnterior;
      const tieneFicheroBase64 = this.ficherosBase64?.[key];

      if (camposFichero.includes(key)) {
        if (!tieneFicheroBase64) return arr; // No se adjuntó nuevo → no enviar cambio
      } else {
        const hayCambio = nuevoValor !== valorAnterior;
        if (!hayCambio && !tieneFicheroBase64) return arr; // No hay cambio real
      }

      if (hayCambio || tieneFicheroBase64) {
        const registro: any = {
          FechayHora: ahora,
          NoTabla: tabla,
          NoCampo: this.camposMap[key as keyof typeof this.camposMap],
          ValorNuevo: String(nuevoValor),
          SystemIdRegistro: tabla === 50111 ? systemIdCentro001 : systemId,
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
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // marca campos para mostrar errores
      this.snackBar.open('Por favor completa los campos obligatorios.', 'Cerrar', { duration: 4000, verticalPosition: 'top' });
      return;
    }

    const body = this.genChanges(this.generarCodigoAgrupacion());

    try{
      this.loading = true;
      const url = environment.url + "registroscambiosHeader?$expand=registroscambios";
      const result = await firstValueFrom(this.http.post(url, body));
      this.loading = false;

      this.snackBar.open('Datos pendientes de revisión', 'Cerrar', { duration: 4000, verticalPosition: 'top' });
      this.enableEdit = false;

      const updatedData = await this.companyService.refreshCompanyData(this.companyData.SystemId, false);
      if (updatedData) {
        this.companyData = updatedData;
      }
      this.getChanges();
      this.setValueFields();
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
      this.formulario.get('EMail')?.enable();
      this.formulario.get('VATRegistrationNo')?.enable();
      this.formulario.get('CodTransportista')?.enable();
      this.formulario.get('NIMATransportista')?.enable();
      this.formulario.get('CountryRegionCode')?.enable();
      this.formulario.get('MobilePhoneNo')?.enable();
      this.formulario.get('CertificadoTitularidadBancariaPresentado')?.enable();
      this.formulario.get('TarjetaNIFEmpresaPresentada')?.enable();
      this.formulario.get('CodProductor')?.enable();
      this.formulario.get('NIMAProductor')?.enable();
      this.formulario.get('CodGestor')?.enable();
      this.formulario.get('NIMAGestor')?.enable();
      this.formulario.get('EMailEnvioServicio')?.enable();
      this.formulario.get('EMailEnvioDocAmbiental')?.enable();
    } else {
      this.formulario.get('Name')?.disable();
      this.formulario.get('Address')?.disable();
      this.formulario.get('City')?.disable();
      this.formulario.get('PhoneNo')?.disable();
      this.formulario.get('PostCode')?.disable();
      this.formulario.get('County')?.disable();
      this.formulario.get('EMail')?.disable();
      this.formulario.get('VATRegistrationNo')?.disable();
      this.formulario.get('CodTransportista')?.disable();
      this.formulario.get('NIMATransportista')?.disable();
      this.formulario.get('CountryRegionCode')?.disable();
      this.formulario.get('MobilePhoneNo')?.disable();
      this.formulario.get('CertificadoTitularidadBancariaPresentado')?.disable();
      this.formulario.get('TarjetaNIFEmpresaPresentada')?.disable();
      this.formulario.get('CodProductor')?.disable();
      this.formulario.get('NIMAProductor')?.disable();
      this.formulario.get('CodGestor')?.disable();
      this.formulario.get('NIMAGestor')?.disable();
      this.formulario.get('EMailEnvioServicio')?.disable();
      this.formulario.get('EMailEnvioDocAmbiental')?.disable();
    }
  }

  edit() {
    this.enableEdit = !this.enableEdit;
    this.EnableDisableCtrls();
  }

  centers() {
    this.router.navigate(['centers']);
  }

  contacts() {
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
      c =>
      (c.No_Tabla === this.noTabla && c.SystemId_Registro === this.companyData.SystemId) ||
      (c.No_Tabla === 50111 && c.SystemId_Registro === this.getCentro001()?.SystemId)
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
    const tabla = this.campoTablaMap[campo];

    if (!tabla) return { valor: '', esPendiente: false }; // campo desconocido

    // Buscar en los cambios pendientes filtrando también por tabla
    const cambios = (this.companyData?.cambiosempresasgreenbc ?? []).filter(
      c => c.No_Tabla === tabla && this.camposMap[campo as keyof typeof this.camposMap] === c.No_Campo
    );

    if (cambios.length > 0) {
      const cambio = cambios.reduce((a, b) => a.No_Mov > b.No_Mov ? a : b);
      return { valor: cambio.Valor_Nuevo ?? '', esPendiente: true };
    }

    if (tabla === 50111) {
      const centro001 = this.companyData.centrosempresasgreenbc.find(c => c.Code === '001');
      return { valor: (centro001 as any)?.[campo] ?? '', esPendiente: false };
    } else {
      return { valor: (this.companyData as any)?.[campo] ?? '', esPendiente: false };
    }
  }

  getCentro001() {
    return this.companyData.centrosempresasgreenbc.find(c => c.Code === '001');
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
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // quita el prefijo

      // Guarda el nombre visible
      this.formulario.get(campo)?.setValue(file.name);

      // Guarda solo el base64 puro
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

  get hayCambiosPendientes(): boolean {
    return Object.keys(this.cambiosPorCampo).length > 0;
  }
}
