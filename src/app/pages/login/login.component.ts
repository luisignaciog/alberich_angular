import { Component } from '@angular/core';

import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environmets/environment';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,ReactiveFormsModule
  ],
})
export class LoginComponent {
  loginData: LoginData = createEmptyLoginData();
  formulario: FormGroup;

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar, private fb: FormBuilder)
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
      const url = environment.url + `passwordempresasgreenbc('${this.formulario.value.userName}', '${this.formulario.value.password}')`;
      this.loginData = await lastValueFrom(this.http.get<LoginData>(url));
      console.log(this.loginData);
    } catch (error: any) {
      if (error.status === 0) {
        this.snackBar.open('No hay conexión al servidor.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
      } else {
        this.snackBar.open('Usuario o contraseña no válidos', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
      }
    }
  }
}
