import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-centers',
  templateUrl: './centers.component.html',
  styleUrl: './centers.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, NgIf],
})
export class CentersComponent {
  loading: boolean = false;
}
