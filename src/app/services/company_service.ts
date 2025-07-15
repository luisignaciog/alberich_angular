import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    private companyDataMap = new Map<string, BehaviorSubject<any>>();

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
}
