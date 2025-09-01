import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyData, centers, createEmptyCompanyData } from '../../models/center_data_interface';
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
  centerData: CompanyData = createEmptyCompanyData();
  loading: boolean = false;
  dataSource: MatTableDataSource<centers> = new MatTableDataSource<centers>();
  displayedColumns: string[] = ['Code','Name','City', 'estado','actions']; //,'CodProductor','CodGestor','CodTransportista','EMailEnvioServicio','EMailEnvioDocAmbiental'];
  noTabla = 50111; // Tabla de centros en GreenBC
  disableButtonContacts: boolean = false;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private snackBar: MatSnackBar, private session: SessionStorageService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.centerData = this.session.getData();

    if (this.centerData === null) {
      this.router.navigate(['login']);
      return;
    }

    this.loading = true;

    const cambios = this.centerData.cambiosempresasgreenbc ?? [];

    // Filtra cambios nuevos (que no tienen registro principal aún)
    const nuevosPendientes = cambios
      .filter(c =>
        c.No_Tabla === this.noTabla &&
        c.Tipo_de_Cambio === 'Insertion' &&
        c.No_Campo === 3
      )
      .reduce((acc, cambio) => {
        if (!acc.some(e => e.SystemId === cambio.SystemId_Registro)) {
          acc.push({
            "@odata.etag": "",
            NoEmpresaGreenBC: "",
            SystemId: cambio.SystemId_Registro,
            Code: '(nuevo)',
            Name: cambio.Valor_Nuevo,
            Name2: '',
            Address: '',
            Address2: '',
            City: '',
            PhoneNo: '',
            CountryRegionCode: '',
            PostCode: '',
            County: '',
            EMail: '',
            CodProductor: '',
            NIMAProductor: '',
            CodGestor: '',
            NIMAGestor: '',
            EMailEnvioServicio: '',
            EMailEnvioDocAmbiental: '',
            SystemModifiedAt: '',
            esNuevo: true // <- marcar que es un nuevo
          });
        }
        return acc;
      }, [] as (centers & { esNuevo?: boolean })[]);

    // Combina centros reales + nuevos pendientes
    const centrosConMarcado = [
      ...this.centerData.centrosempresasgreenbc.map(c => ({ ...c, esNuevo: false })),
      ...nuevosPendientes
    ];

    this.dataSource = new MatTableDataSource(centrosConMarcado);

    this.disableButtonContacts = (this.centerData!.centrosempresasgreenbc!.length <= 0 && nuevosPendientes.length <= 0);

    this.loading = false;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editCenter(center: centers){
    this.openDialogCenter(center);
  }

  newCenter()
  {
    const body: centers = {
        "@odata.etag": "",
        NoEmpresaGreenBC: "",
        Code: "",
        Name: "",
        Name2: "",
        Address: "",
        Address2: "",
        City: "",
        PhoneNo: "",
        CountryRegionCode: "",
        PostCode: "",
        County: "",
        EMail: "",
        CodProductor: "",
        NIMAProductor: "",
        CodGestor: "",
        NIMAGestor: "",
        EMailEnvioServicio: "",
        EMailEnvioDocAmbiental: "",
        SystemModifiedAt: "",
        SystemId: this.centerData.SystemId
      }

    const dialogRef = this.dialog.open(CenterDialogComponent, {
      data: { center: body }
    });
  }

  openDialogCenter(center: centers) {
    const dialogRef = this.dialog.open(CenterDialogComponent, {
      //width: '70vw',
      //height: '65vh',
      //maxWidth: '100vw', // evita el límite predeterminado de 80vw
      //panelClass: 'custom-dialog-container',
      data: { center }
    });

    dialogRef.afterClosed().subscribe((resultado: centers) => {
      if (resultado && Array.isArray(resultado)) {
        if (resultado.length > 0) {
          console.log('Resultado del diálogo:', resultado);
        }
      }
    });
  }

  tieneCambiosPendientes(centro: centers): boolean {
    return this.centerData.cambiosempresasgreenbc?.some(cambio =>
      cambio.No_Tabla === this.noTabla && // o usa this.noTabla si lo defines
      cambio.Tipo_de_Cambio === 'Modification' &&
      cambio.SystemId_Registro === centro.SystemId
    ) ?? false;
  }

  contacts() {
    this.router.navigate(['contacts']);
  }

  home() {
    this.router.navigate(['home']);
  }
}
