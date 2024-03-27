import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { CostService } from 'src/app/service/cost/cost.service';
import { LocationService } from 'src/app/service/location/location.service';
import { NewProposalLayoutPreviewComponent } from '../layout-preview/layout-preview.component';
import { Location } from '@angular/common'

@Component({
  selector: 'new-proposal-space-availability',
  templateUrl: './space-availability.component.html',
  styleUrls: ['./space-availability.component.scss'],
})
export class NewProposalSpaceAvailabilityComponent implements OnInit {
  setButtonDisable: boolean = false;
  goBack(){
    this.location.back();
  }
  nonStandardRequirement: boolean = false;
  proposalId!: string;
  isServiced: boolean = true;
  isAcceptConsolidatedSeats: boolean = true;
  locationId!:string;
  selectFrom: 'left' | 'right' = 'left';
  seatAvailability: boolean = true;
  consolidatedSeats: boolean = false;
  totalNumberofSeat:any;
  costOfElectricity:any;
  // costOfOps:any;
  // rentValue:any;
  // camValue:any;
  selectedLocation:any;
  selectedCenter:any;
  finalAmount:any;
  // getRackValue:any;
  proposalExtraDetailForm = new FormGroup({
    consolidated: new FormControl(''),
    Tenure: new FormControl('60', Validators.required),
    LockIn: new FormControl('36', Validators.required),
    depositTerm:new FormControl('12',Validators.required),
    noticePeriod:new FormControl('6',Validators.required),
    NonStandardRequirement: new FormControl(''),
    Serviced: new FormControl('', Validators.required),
    rentCommencmentDate: new FormControl('',Validators.required),
  });

  constructor(
    private location:Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService,
  ) {}

  onSubmit = () => {};

  ngOnInit(): void {

    // this.consolidatedSeats = this.proposalService.consolidatedSeats;
    // this.seatAvailability = this.proposalService.seatAvailability;
    this.proposalId = this.route.snapshot.params['proposalId'];
    this.proposalService.checkSeatAvailability(this.proposalId).subscribe({
      next: (result: any) => {
        this.consolidatedSeats = result.consolidatedSeats;
        this.seatAvailability = result.seatAvailability;
        this.totalNumberofSeat = result.totalNumberOfSeats;
        this.selectedLocation = result.location;
        this.selectedCenter = result.center;
        this.locationId=result.locationId;
        this.content=result.content
      },
      error: (err: any) => {},
    });

  }
content:any;
  openDialog = () => {
    const dialogRef = this.dialog.open(NewProposalLayoutPreviewComponent, {
      width: '1080px',
      height: '734px',
      panelClass: 'my-panel-class',
      data: { locationId: this.locationId, proposalId: this.proposalId, totalNoOfSeat:this.totalNumberofSeat, content:this.content },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result === true){
        this.setButtonDisable= true
      }
    });

  };

  generateProposal = () => {
    let serviced = this.isServiced ? 'yes' : 'no';
    let acceptConsolidatedSeats = this.isAcceptConsolidatedSeats ? 'yes' : 'no';
    this.proposalExtraDetailForm.patchValue({
      consolidated: acceptConsolidatedSeats,
      Serviced: serviced,
    });

    if (this.proposalExtraDetailForm.invalid) {
      return;
    }
    // console.log(this.proposalExtraDetailForm.value.serviceCosts," before proposal service ")
    this.proposalService.generateProposal(this.proposalId, this.selectFrom, this.proposalExtraDetailForm.value).subscribe({
        next: (result: any) => {
          if (result.Message === 'Proposal Generated Successfully') {
            this.router.navigate(['/sales', 'sales-dashboard']);
          }
        },
        error: (err: any) => {},
      });

  }


}
