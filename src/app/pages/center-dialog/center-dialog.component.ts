import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-center-dialog',
  templateUrl: './center-dialog.component.html',
  styleUrl: './center-dialog.component.css',
  imports: [MatProgressSpinnerModule, FormsModule,
    ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatInputModule, MatFormFieldModule, MatIcon, NgIf],
})
export class CenterDialogComponent {
  formulario: FormGroup;
  enableEdit: boolean = false;
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
      email: ['', [
        //Validators.required,
        //Validators.email
      ]],
      eMailEnvioServicio: ['', [
        //Validators.required,
        //Validators.email
      ]],
      eMailEnvioDocAmbiental: ['', [
        //Validators.required,
        //Validators.email
      ]],
    });
  }

  cancel() {
    this.enableEdit = false;
  }

  save(){
    console.log(this.formulario.value);
  }

  edit() {
    this.enableEdit = !this.enableEdit;
  }
}
