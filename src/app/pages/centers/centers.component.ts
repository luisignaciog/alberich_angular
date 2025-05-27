import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CenterData, centers, createEmptyCenterData } from '../../models/center_data_interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CenterDialogComponent } from '../center-dialog/center-dialog.component';
@Component({
  selector: 'app-centers',
  templateUrl: './centers.component.html',
  styleUrl: './centers.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, NgIf, MatTableModule, MatPaginatorModule, MatSortModule,
    MatIcon, MatButtonModule],
})
export class CentersComponent implements OnInit, AfterViewInit {
  centerData: CenterData = createEmptyCenterData();
  loading: boolean = false;
  dataSource: MatTableDataSource<centers> = new MatTableDataSource<centers>();
  displayedColumns: string[] = ['Code','Name','City','PhoneNo','EMail', 'actions']; //,'CodProductor','CodGestor','CodTransportista','EMailEnvioServicio','EMailEnvioDocAmbiental'];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.centerData = this.session.getData();

    if (this.centerData === null) {
      this.router.navigate(['login']);
    }

    this.loading = true;
    this.dataSource = new MatTableDataSource<centers>(this.centerData.centrosempresasgreenbc);
    this.loading = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  newCenter(){
    this.snackBar.open('On development', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
  }

  editCenter(center: centers){
    this.snackBar.open('On development', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top' });
  }

  openDialogCenter() {
    const dialogRef = this.dialog.open(CenterDialogComponent, {
      //width: '70vw',
      //height: '65vh',
      //maxWidth: '100vw', // evita el límite predeterminado de 80vw
      //panelClass: 'custom-dialog-container',
      data: { /* opcional: puedes pasar datos aquí */ }
    });

    dialogRef.afterClosed().subscribe((resultado: centers) => {
      if (resultado && Array.isArray(resultado)) {
        if (resultado.length > 0) {
          console.log('Resultado del diálogo:', resultado);
        }
      }
    });
  }


}
