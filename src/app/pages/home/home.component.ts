import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { createEmptyLoginData, LoginData } from '../../models/login_data_interface';
import { SessionStorageService } from '../../models/session-storage-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent],
})
export class HomeComponent {
  loginData: LoginData = createEmptyLoginData();

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService, private router: Router ) { }

  ngOnInit() {
    this.loginData = this.session.getData();

    if (this.loginData === null) {
      this.router.navigate(['login']);
    }
  }

}
