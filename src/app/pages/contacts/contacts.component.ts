import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CompanyData, contacts, createEmptyCompanyData } from '../../models/center_data_interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../models/session-storage-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  imports: [NavbarComponent, MatProgressSpinnerModule, NgIf, MatTableModule, MatPaginatorModule, MatSortModule,
    MatIcon, MatButtonModule],
})
export class ContactsComponent implements AfterViewInit, OnInit {
  companyData: CompanyData = createEmptyCompanyData();
  loading: boolean = false;
  dataSource: MatTableDataSource<contacts & { esNuevo?: boolean }> = new MatTableDataSource();

  displayedColumns: string[] = ['Name','EMail', 'estado', 'actions'];
  noTabla = 5050; // Tabla de contactos en GreenBC

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor( private snackBar: MatSnackBar, private session: SessionStorageService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.companyData = this.session.getData();

    if (this.companyData === null) {
      this.router.navigate(['login']);
      return;
    }

    this.loading = true;

    const cambios = this.companyData.cambiosempresasgreenbc ?? [];

    const nuevosPendientes = cambios
      .filter(c =>
        c.No_Tabla === this.noTabla &&
        c.Tipo_de_Cambio === 'Insertion' &&
        c.No_Campo === 2
      )
      .map(cambio => ({
        SystemId: cambio.SystemId_Registro,
        No: '(nuevo)',
        Name: cambio.Valor_Nuevo,
        Name2: '',
        PhoneNo: '',
        EMail: '',
        esNuevo: true // <- marcar que es un nuevo
      }));

    const contactosCompletos = [
      ...this.companyData.contactosempresasgreenbc.map(c => ({ ...c, esNuevo: false })),
      ...nuevosPendientes
    ];

    this.dataSource = new MatTableDataSource<contacts & { esNuevo?: boolean }>(contactosCompletos);

    this.loading = false;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editContact(contact: contacts) {
    this.openDialogContact(contact);
  }

  openDialogContact(contact: contacts) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: { contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && Array.isArray(result)) {
        if (result.length > 0) {
          console.log('Resultado del diálogo:', result);
        }
      }
    });
  }

  newContact()
    {
      const dialogRef = this.dialog.open(ContactDialogComponent, {
        data: { }
      });
    }

  tieneCambiosPendientes(contact: contacts): boolean {
    return this.companyData.cambiosempresasgreenbc?.some(cambio =>
      cambio.No_Tabla === this.noTabla && // o usa this.noTabla si lo defines
      cambio.Tipo_de_Cambio === 'Modification' &&
      cambio.SystemId_Registro === contact.SystemId
    ) ?? false;
  }
}
