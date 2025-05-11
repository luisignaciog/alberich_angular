import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { SessionStorageService } from '../../models/session-storage-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CenterData, createEmptyCenterData } from '../../models/center_data_interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, FormsModule,ReactiveFormsModule
    , MatInputModule, MatFormFieldModule, NgIf, MatIcon, MatButtonModule]
})
export class HomeComponent {
  centerData: CenterData = createEmptyCenterData();
  formulario: FormGroup;
  loading: boolean = false;
  enableEdit: boolean = false;

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService, private router: Router, private fb: FormBuilder ) {
    this.formulario = this.fb.group({
      name: ['', [
        //Validators.required,
        //Validators.maxLength(20)
      ]],
      address: ['', [
        //Validators.required,
      ]],
      city: ['', [
        //Validators.required,
      ]],
      phoneNo: ['', [
        //Validators.required,
        //Validators.pattern(/^\d{10}$/)
      ]],
      postCode: ['', [
        //Validators.required,
        //Validators.pattern(/^\d{5}$/)
      ]],
      county: ['', [
        //Validators.required,
      ]],
      vatRegistrationNo: ['', [
        //Validators.required,
      ]],
    });
  }

  ngOnInit() {
    this.centerData = this.session.getData();

    if (this.centerData === null) {
      this.router.navigate(['login']);
    }

    this.formulario.setValue({
      name: this.centerData.Name,
      address: this.centerData.Address,
      city: this.centerData.City,
      phoneNo: this.centerData.PhoneNo,
      postCode: this.centerData.PostCode,
      county: this.centerData.County,
      vatRegistrationNo: this.centerData.VATRegistrationNo
    });

    this.EnableDisableCtrls();
  }

  save() {
    this.snackBar.open('Datos guardados', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
    this.enableEdit = false;
    this.EnableDisableCtrls();
  }

  cancel() {
    this.enableEdit = false;
    this.EnableDisableCtrls();
  }

  EnableDisableCtrls() {
    if (this.enableEdit) {
      this.formulario.get('name')?.enable();
      this.formulario.get('address')?.enable();
      this.formulario.get('city')?.enable();
      this.formulario.get('phoneNo')?.enable();
      this.formulario.get('postCode')?.enable();
      this.formulario.get('county')?.enable();
      this.formulario.get('vatRegistrationNo')?.enable();
    } else {
      this.formulario.get('name')?.disable();
      this.formulario.get('address')?.disable();
      this.formulario.get('city')?.disable();
      this.formulario.get('phoneNo')?.disable();
      this.formulario.get('postCode')?.disable();
      this.formulario.get('county')?.disable();
      this.formulario.get('vatRegistrationNo')?.disable();
    }
  }

  edit() {
    this.enableEdit = !this.enableEdit;
    this.EnableDisableCtrls();
  }
}
