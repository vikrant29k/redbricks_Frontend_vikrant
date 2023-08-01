
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LocationLayoutPreviewComponent } from '../proposal-lists/layout-preview-all/location-layout-preview.component';
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
  selector: 'app-layout-list',
  templateUrl: './layout-list.component.html',
  styleUrls: ['./layout-list.component.scss']
})
export class LayoutListComponent implements OnInit {

  height!: string;
  Locations: any;
  editMode: boolean = false;
  displayedColumns: string[] = ['location', 'center','floor', 'availableNoOfWorkstation', 'totalNoOfWorkstation', 'edit', 'delete'];
  dataSource!: MatTableDataSource<LocationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationData>;

  constructor(
    private cd: ChangeDetectorRef,
    private locationService: LocationService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
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

  viewProposal(id: any, jsonId:any)
  {
    this.router.navigate(['/admin','view-layouts','proposal-list',id,jsonId]);
  }

  viewLayout(id: any) {
      // this.router.navigate(['/admin','view-layouts','show-layout',id]);
      // viewAllLayout(){
        // let dataarray={
        //   proposalArray:this.proposalArray,
        //   locationId:this.id,
        // };
        const dialogRef = this.dialog.open(LocationLayoutPreviewComponent, {
          width: '800px',
          height: '566px',
          data: { jsonId:id },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log('Dialog closed Successfully!');
        });

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
