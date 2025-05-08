import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { SessionStorageService } from '../../models/session-storage-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CenterData, createEmptyCenterData } from '../../models/center_data_interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, FormsModule,ReactiveFormsModule
    , MatInputModule, MatFormFieldModule, NgIf],
})
export class HomeComponent {
  centerData: CenterData = createEmptyCenterData();
  formulario: FormGroup;
  loading: boolean = false;

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
      phone: ['', [
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
  }

  save() {
    console.log(this.centerData);
  }
}
