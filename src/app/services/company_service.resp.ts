import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environmets/environment';
import { CompanyData } from '../models/center_data_interface';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CompanyServiceResp {
    private companyDataMap = new Map<string, BehaviorSubject<any>>();

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private router: Router
    ) {}

    setCompanyData(systemId: string, data: any) {
        if (!this.companyDataMap.has(systemId)) {
            this.companyDataMap.set(systemId, new BehaviorSubject<any>(null));
        }
        this.companyDataMap.get(systemId)?.next(data);
        sessionStorage.setItem(`companyData_${systemId}`, JSON.stringify(data));
    }

    getCompanyData(systemId: string) {
      const storedData = sessionStorage.getItem(`companyData_${systemId}`);

        if (storedData) {
            return JSON.parse(storedData);
        }
        return this.companyDataMap.get(systemId)?.value || null;
    }

    getCompanyDataObservable(systemId: string) {
        if (!this.companyDataMap.has(systemId)) {
            this.companyDataMap.set(systemId, new BehaviorSubject<any>(null));
        }
        return this.companyDataMap.get(systemId)?.asObservable();
    }

    async refreshCompanyData(systemId: string, navigate = false): Promise<CompanyData | null> {
    try {
      const url = environment.url + `empresasgreenbc(${systemId})?$expand=centrosempresasgreenbc,contactosempresasgreenbc,cambiosempresasgreenbc`;
      const companyData = await lastValueFrom(this.http.get<CompanyData>(url));
      this.setCompanyData(systemId, companyData);

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
