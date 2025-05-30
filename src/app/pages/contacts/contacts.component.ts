import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CenterData, contacts, createEmptyCenterData } from '../../models/center_data_interface';
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
  centerData: CenterData = createEmptyCenterData();
  loading: boolean = false;
  dataSource: MatTableDataSource<contacts> = new MatTableDataSource<contacts>();
  displayedColumns: string[] = ['No','Name','PhoneNo','EMail', 'actions'];

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
    this.dataSource = new MatTableDataSource<contacts>(this.centerData.contactosempresasgreenbc);
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
}
