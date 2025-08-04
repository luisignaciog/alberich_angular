import { CompanyData, createEmptyCompanyData, centers } from './../../models/center_data_interface';
import { Component } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router, NavigationEnd  } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, CommonModule],
})
export class NavbarComponent {
  companyData: CompanyData = createEmptyCompanyData();
  userName: string = '';
  isHome: boolean = true;

  constructor( private session: SessionStorageService, private router: Router ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHome = event.urlAfterRedirects === '/home';
    });
  }

  ngOnInit() {
    this.companyData = this.session.getData();

    if (this.companyData != null) {
      this.userName = this.companyData.Name;
    }
  }

  logout() {
    this.session.clearData();
    this.companyData = createEmptyCompanyData();
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
