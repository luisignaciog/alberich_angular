// company.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CompanyData } from '../models/center_data_interface';
import { SessionStorageService } from '../models/session-storage-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environmets/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(
    private http: HttpClient,
    private session: SessionStorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async refreshCompanyData(systemId: string, navigate = false): Promise<CompanyData | null> {
    try {
      const url = environment.url + `empresasgreenbc(${systemId})?$expand=centrosempresasgreenbc,contactosempresasgreenbc,cambiosempresasgreenbc`;
      const companyData = await lastValueFrom(this.http.get<CompanyData>(url));
      this.session.setData(companyData);

      if (navigate) {
        this.router.navigate(['home']);
      }

      return companyData;
    } catch (error: any) {
      const msg = error?.status === 0
        ? 'No hay conexión al servidor.'
        : 'Error al obtener los datos de la empresa.';
      this.snackBar.open(msg, 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return null;
    }
  }
}
