import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { LocationService } from 'src/app/service/location/location.service';
import { Component, OnInit,Inject } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
export interface DialogData { id: any;}
@Component({
  selector: 'app-sales-head-approval',
  templateUrl: './sales-head-approval.component.html',
  styleUrls: ['./sales-head-approval.component.scss']
})
export class SalesHeadApprovalComponent implements OnInit {

id:any;
proposalData: any;
dta:any;
  constructor(private proposalService:ProposalService,
    public dialogRef: MatDialogRef<SalesHeadApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private dashboardService:DashboardService) { }

  ngOnInit() {
    this.id=this.dialogData.id
    this.getProposalData();
    this.getData();
  }

  getProposalData() {
    this.proposalService.getProposalById(this.id).subscribe(
      (data:any) => {
          this.proposalData = data;
          console.log('Proposal Data:', this.proposalData);
        },
      );
  }

getData(){
  this.dashboardService.getProposalData(this.id).subscribe((res:any)=>{
    this.dta=res;
    console.log('data:',this.dta)
  })
}

  approveProposal() {
    Swal.fire({
      title: 'Approve Proposal',
      text: 'Are you sure you want to approve this proposal?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#C3343A'
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {

      }
    })
  }

 declineProposal(){
  Swal.fire({
    title: 'Decline Proposal',
    icon: 'info',
    showConfirmButton: true,
    confirmButtonText: 'Confirm',
    confirmButtonColor: '#C3343A',
    input: 'text',
    inputAttributes:{
      required:'true'
    } ,
    inputLabel: 'Note',
    showCancelButton: true,
    cancelButtonColor: '#7D7E80',
  }).then((confirmation) => {
    if (confirmation.isConfirmed) {

    }
  })
 }
}
