import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewProposalLayoutPreviewComponent } from './layout-preview/layout-preview.component';
import { LayoutDataService } from 'src/app/service/layout data/layoutData.service';
export interface LocationData {
  proposalId:string,
  seatSelected:number,
  color:string,
  drawLayout:string,
  delete:string,
}
@Component({
  selector: 'app-proposal-lists',
  templateUrl: './proposal-lists.component.html',
  styleUrls: ['./proposal-lists.component.scss']
})
export class ProposalListsComponent implements OnInit {

  id:any;
  height!: string;
  Locations: any;
  editMode: boolean = false;
  // displayedColumns: string[] = ['proposalId', 'seatSelected', 'color','drawLayout'];
  displayedColumns: string[] = ['proposalId', 'seatSelected', 'drawLayout','delete'];
  dataSource!: MatTableDataSource<LocationData>;
color:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationData>;

  constructor(
    private dialog: MatDialog,
    private layoutService:LayoutDataService,
    private cd: ChangeDetectorRef,
    private locationService: LocationService,
    private authService: AuthenticationService,
    private router: Router,
    private activeRoute:ActivatedRoute,
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
proposalArray:any[]=[];

jsonId:any;
center:any;
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['Id'];
    this.center = this.activeRoute.snapshot.params['jsonId']
    console.log(this.jsonId,"JsonId")
    this.getCenterData(this.id)
    // this.getAllLocations()
  }
getCenterData = (centerId: string) => {
  this.locationService.getLocationById(centerId).subscribe({
    next: (result: any) => {
      console.log(result.proposals);

      // Filter the proposals array to only include objects where locked is true
      this.proposalArray = [...result.proposals]
        .filter((proposal) => proposal.locked)
        .map((proposal) => ({ ...proposal, color: this.getRandomColor() }));

      this.tableDataSource(this.proposalArray);
    },
    error: (error: any) => {
      console.error("Error occurred while fetching center data:", error);
      // Handle the error appropriately or send a response back to the client
      // ...
    },
  });
};
private getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

deleteProposal(id:string){
  this.layoutService.deleteProposalLayout(id).subscribe(res=>{
    console.log(res)
  })
}
drawLayout = (id:string) => {
 console.log(id)
  this.router.navigate(['/admin', 'view-layouts', 'proposal-preview', id]);
};
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // viewAllLayout(){
  //   // let dataarray={
  //   //   proposalArray:this.proposalArray,
  //   //   locationId:this.id,
  //   // };
  //   const dialogRef = this.dialog.open(LocationLayoutPreviewComponent, {
  //     width: '800px',
  //     height: '566px',
  //     data: { jsonId:this.jsonId },
  //   });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('Dialog closed Successfully!');
    // });


    // this.layoutDataService.drawAllLayout(dataarray).subscribe(res=>{
    //   console.log(res,"API response")
    // })
    // console.log("send Data to the api", this.proposalArray);
  }




// }
