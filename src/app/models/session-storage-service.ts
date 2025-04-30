import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
    private userDataMap = new Map<string, BehaviorSubject<any>>();

    setData(data: any) {
      const userId = "userData"
        if (!this.userDataMap.has(userId)) {
            this.userDataMap.set(userId, new BehaviorSubject<any>(null));
        }
        this.userDataMap.get(userId)?.next(data);
        sessionStorage.setItem(userId, JSON.stringify(data));
    }

    getData() {
      const userId = "userData"
      const storedData = sessionStorage.getItem(userId);

        if (storedData) {
            return JSON.parse(storedData);
        }
        return this.userDataMap.get(userId)?.value || null;
    }

    getDataObservable() {
      const userId = "userData"
        if (!this.userDataMap.has(userId)) {
            this.userDataMap.set(userId, new BehaviorSubject<any>(null));
        }
        return this.userDataMap.get(userId)?.asObservable();
    }

    clearData() {
        const userId = "userData"
        this.userDataMap.delete(userId);
        sessionStorage.removeItem(userId);
    }
}
