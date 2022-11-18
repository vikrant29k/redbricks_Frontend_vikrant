
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  Locations: any;
  editMode: boolean = false;
  displayedColumns: string[] = ['city', 'state', 'area', 'dimension', 'edit', 'delete'];
  dataSource!: MatTableDataSource<LocationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationData>;

  constructor(
    private cd: ChangeDetectorRef,
    private locationService: LocationListService,
    private authService: AuthenticationService
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



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }  
}
