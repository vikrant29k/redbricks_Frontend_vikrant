import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { MatDialog } from '@angular/material/dialog';
import { DeselectUpdateComponent } from '../deselect-update/deselect-update.component';
export interface OldProposalData {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'old-proposal-table',
  templateUrl: './old-proposal-table.component.html',
  styleUrls: ['./old-proposal-table.component.scss'],
})
export class OldProposalTableComponent implements OnInit {
  allData: any;
  selectedSeat:any;
  // idForDeslect:any;
  displayedColumns: string[] = [
    'proposalId',
    'date',
    'status',
    'esclateToCloser',
    'action',
    // 'update'
  ];
  dataSource!: MatTableDataSource<OldProposalData>;

  @ViewChild(MatTable) table!: MatTable<OldProposalData>;
  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog:MatDialog,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.getAllProposal();
  }

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  getAllProposal = () => {
    this.proposalService.getAllProposal().subscribe({
      next: (result: any) => {
        result = result.reverse();
        this.tableDataSource(result);

        this.allData = result;
      },
    });
  };

  tableDataSource = (data: any) => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.Paginator;
    // this.table.renderRows();
  };

  changeButtonLabel(status: any) {
    if (['In-Progress', 'Conflict', 'Conflict Resolved'].includes(status)) {
      return 'Continue';
    } else {
      return 'View Details';
    }
  }
  continuePage(Id: string) {
    this.router.navigate(['/sales', 'new-proposal', 'space-availability', Id]);
  }
  esclateToCloser = (Id: string) => {
    // old - proposal / closure / asdfas
    this.router.navigate(['/sales', 'old-proposal', 'closure', Id]);
  };

  viewDetails = (Id: string) => {
    this.router.navigate(['/sales', 'new-proposal', 'proposal-preview', Id]);
  };

showPopOver(data_id:any){
var location;
var center;
 for(let i = 0; i < this.allData.length;i++){
if(data_id == this.allData[i]._id){
  this.selectedSeat=this.allData[i].totalNoOfSeatsSelected;
  location = this.allData[i].location;
  center = this.allData[i].center;
}
 }
  const dialogRef = this.dialog.open(DeselectUpdateComponent, {
  width: '20rem',
  hasBackdrop: true,
  data: {
    info:{
      idForDeselect:data_id,
      location:location,
      center:center,
      seatSelected:this.selectedSeat
    }

},

});
}

}
