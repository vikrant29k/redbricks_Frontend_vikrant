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
  goBack(){
    this.location.back();
  }
  nonStandardRequirement: boolean = false;
  proposalId!: string;
  isServiced: boolean = false;
  isAcceptConsolidatedSeats: boolean = true;
  selectFrom: 'left' | 'right' = 'left';
  seatAvailability: boolean = true;
  consolidatedSeats: boolean = false;
  totalNumberofSeat:any;
  costOfElectricity:any;
  costOfOps:any;
  rentValue:any;
  camValue:any;
  selectedLocation:any;
  selectedCenter:any;
  finalAmount:any;
  getRackValue:any;
  proposalExtraDetailForm = new FormGroup({
    consolidated: new FormControl(''),
    Tenure: new FormControl('', Validators.required),
    LockIn: new FormControl('', Validators.required),
    NonStandardRequirement: new FormControl(''),
    Serviced: new FormControl('', Validators.required),
    serviceCosts: new FormControl(''),
    finalOfferAmmount: new FormControl(''),
    rackValue: new FormControl(''),
    systemValue: new FormControl(''),

  });

  constructor(
    private location:Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private costService:CostService,
    private locationService: LocationService,
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

        let data = {
          selectedCenter:this.selectedCenter,
          selectedLocation:this.selectedLocation
        };
        this.locationService.getRentData(data).subscribe((res:any)=>{
          this.rentValue = res[0].rentSheet[0].rent;
          this.camValue = res[0].rentSheet[0].cam;
          this.getRackValue=res[0]
        })
      },
      error: (err: any) => {},
    });

  }

  openDialog = () => {

    const dialogRef = this.dialog.open(NewProposalLayoutPreviewComponent, {
      width: '800px',
      height: '566px',
      data: { proposalId: this.proposalId, selectFrom: this.selectFrom },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Dialog closed Successfully!');
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
    console.log(this.proposalExtraDetailForm.value.serviceCosts," before proposal service ")
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
