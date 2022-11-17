
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/service/users/user.service';
import { AddUsersComponent } from 'src/app/pages/users/component/add-user/add-users.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationListService } from 'src/app/service/location-list/location-list.service';

export interface LocationData {
  _id: any,
  city: string,
  state: string,
  area: string,
  locality: string,
  dimension: string,
  address: string,
  pinCode: string,
  images?: string
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  height!: string;
  mediaQuery!: MediaQueryList;
  Locations: any;
  editMode: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private locationService: LocationListService,
    private authService: AuthenticationService
  ) {


  }


  @ViewChild(MatTable) table!: MatTable<LocationData>;

  tableDataSource(data: LocationData[] | undefined) {
    // debugger;

    this.dataSource = new MatTableDataSource(data);
    // this.dataSource.paginator = this.paginator;
    this.cd.detectChanges();
    this.table.renderRows();
  }
  getAllLocations() {
    this.locationService.getAllLocation().subscribe({
      next: (locations: any) => {
        this.Locations = locations
        this.tableDataSource(this.Locations);
      },
      error: (err: any) => {
        this.authService.handleAuthError(err);
      }
    });
  }

  deleteLocation(id: string) {
    this.locationService.deleteLocation(id).subscribe({
      next: () => {
        this.getAllLocations();
      },
      error: (err:any) => {
        this.authService.handleAuthError(err);
      }
    })
  }

  editLoction(id: any) {
    this.locationService.locationIdToUpdate = id;
    this.editMode = true;
    // this.openDialog();
  }

  ngOnInit(): void {
    this.getAllLocations()
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Locations: LocationData[] = [
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'Mumbai', state: 'Mumbai', area: 'mumbai', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' },
  //   { city: 'pune', state: 'Maharastra', area: 'Koregao Park', locality: 'Pasport Office', dimension: '100 X 100', address: 'Koregao Park', pinCode: '411030' }
  // ];

  displayedColumns: string[] = ['city', 'state', 'area', 'dimension', 'edit', 'delete'];
  dataSource!: MatTableDataSource<LocationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // openDialog() {
  //   const dialogRef = this.dialog.open(AddLocationComponent, {
  //     panelClass: 'customDialog',
  //     data: { editMode: this.editMode }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     console.log('Add Location Dialog Closed!!..');
  //     this.editMode = false;
  //     this.getAllLocations();
  //     this.cd.detectChanges();
  //   })
  // }
}
