import { Component } from '@angular/core';

import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environmets/environment';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SessionStorageService } from '../../models/session-storage-service';
import { CenterData, createEmptyCenterData } from '../../models/center_data_interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,ReactiveFormsModule, MatProgressSpinnerModule, NgIf
  ],
})
export class LoginComponent {
  loginData: LoginData = createEmptyLoginData();
  centerData: CenterData = createEmptyCenterData();
  formulario: FormGroup;
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient,
    private snackBar: MatSnackBar, private fb: FormBuilder,
    private session: SessionStorageService)
  {
    this.formulario = this.fb.group({
      userName: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      password: ['', [
        Validators.required,
      ]]
    });
}

  async getUSer()
  {
    try{
      this.loading = true;
      const url = environment.url + `passwordempresasgreenbc('${this.formulario.value.userName}', '${this.formulario.value.password}')`;
      this.loginData = await lastValueFrom(this.http.get<LoginData>(url));
      this.getCompanyData(this.loginData.SystemId);
    } catch (error: any) {
      if (error.status === 0) {
        this.snackBar.open('No hay conexión al servidor.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });

        this.loading = false;
      } else {
        this.snackBar.open('Usuario o contraseña no válidos', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
        this.loading = false;
      }
    }
  }

  async getCompanyData(systemId: string)
  {
    try{
      const url = environment.url + `empresasgreenbc(${systemId})?$expand=centrosempresasgreenbc,contactosempresasgreenbc`;
      this.centerData = await lastValueFrom(this.http.get<CenterData>(url));
      this.session.setData(this.centerData);
      this.loading = false;
      this.router.navigate(['home']);
    } catch (error: any) {
      if (error.status === 0) {
        this.snackBar.open('No hay conexión al servidor.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
        this.loading = false;
      } else {
        this.snackBar.open('Datos del centro no válidos', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
        this.loading = false;
      }
    }

  }
}
