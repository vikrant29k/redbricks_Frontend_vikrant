
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

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
  Locations: any;
  editMode: boolean = false;
  displayedColumns: string[] = ['location', 'center', 'availableNoOfWorkstation', 'totalNoOfWorkstation', 'edit', 'delete'];
  dataSource!: MatTableDataSource<LocationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationData>;

  constructor(
    private cd: ChangeDetectorRef,
    private locationService: LocationService,
    private authService: AuthenticationService,
    private router: Router
  ) { }
  
  tableDataSource(data: LocationData[] | undefined) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
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
    Swal.fire({
      title: 'Delete Location',
      text: 'Are you sure you want to delete this location?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#C3343A'
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.locationService.deleteLocation(id).subscribe({
          next: () => {
            this.getAllLocations();
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          }
        })
      }
    })
  }

  editLocation(id: any) {
    this.router.navigate(['/admin','location','edit-location',id])
    // this.editMode = true;
    // this.openDialog();
  }

  ngOnInit(): void {
    this.getAllLocations()
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }  
}
