import { CenterData, createEmptyCenterData, centers } from './../../models/center_data_interface';
import { Component } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class NavbarComponent {
  centerData: CenterData = createEmptyCenterData();
  userName: string = '';

  constructor( private session: SessionStorageService, private router: Router ) { }

  ngOnInit() {
    this.centerData = this.session.getData();

    if (this.centerData != null) {
      this.userName = this.centerData.Name;
    }
  }

  logout() {
    this.session.clearData();
    this.centerData = createEmptyCenterData();
    this.userName = '';
    this.router.navigate(['login']);
  }

  userData() {
    this.router.navigate(['home']);
  }

  centers() {
    console.log('centers');
    this.router.navigate(['centers']);
  }

  contacts() {
    console.log('contacts');
    this.router.navigate(['contacts']);
  }
}
