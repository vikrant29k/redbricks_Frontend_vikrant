
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
export interface LocationData {
  proposal_id: any,
  location: string,
  center: string,
  floor: string,
  selectedWorkstation: string,
  edit: string,
  delete: string,
  view: string
}
@Component({
  selector: 'app-old-client-list',
  templateUrl: './old-client-list.component.html',
  styleUrls: ['./old-client-list.component.scss']
})
export class OldClientListComponent implements OnInit {
  height!: string;
  Locations: any;
  editMode: boolean = false;
  displayedColumns: string[] = ['proposal_id','location', 'center','floor', 'selectedWorkstation', 'edit', 'delete','view'];
  dataSource!: MatTableDataSource<LocationData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationData>;

  constructor(
    private cd: ChangeDetectorRef,
    private locationService: LocationService,
    private proposalService:ProposalService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog:MatDialog
  ) { }

  tableDataSource(data: LocationData[] | undefined) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.cd.detectChanges();
    this.table.renderRows();
  }

  getAllLocations() {
    // this.locationService.getAllLocation().subscribe({
    //   next: (locations: any) => {
    //     this.Locations = locations
    //     this.tableDataSource(this.Locations);
    //   },
    //   error: (err: any) => {
    //     this.authService.handleAuthError(err);
    //   }
    // });
  }
getAllProposals(){
  this.proposalService.getAllLockedProposal().subscribe({
    next:(proposal:any)=>{
      this.tableDataSource(proposal)
    },
    error: (err: any) => {
      this.authService.handleAuthError(err);
    }
  })
}
previewAll(){
  let id='64ec8d1bc6acddf0eba41677'
  this.router.navigate(['/admin', 'old-proposal', 'preview-all',id]);
}

  deleteLocation(id: string) {
    Swal.fire({
      title: 'Delete Proposal',
      text: 'Are you sure you want to delete this proposal?',
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
  setBorder(id: any) {
       this.router.navigate(['/admin','location','layout-editor',id])
          }

  editLocation(id: any) {
    this.router.navigate(['/admin','location','edit-location',id])
    // this.editMode = true;
    // this.openDialog();
  }

  ngOnInit(): void {
    // this.getAllLocations()
    this.getAllProposals()
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
