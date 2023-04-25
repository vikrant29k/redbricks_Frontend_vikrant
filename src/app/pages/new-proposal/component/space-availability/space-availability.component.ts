import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { CostService } from 'src/app/service/cost/cost.service';
import { LocationService } from 'src/app/service/location/location.service';
import { NewProposalLayoutPreviewComponent } from '../layout-preview/layout-preview.component';
@Component({
  selector: 'new-proposal-space-availability',
  templateUrl: './space-availability.component.html',
  styleUrls: ['./space-availability.component.scss'],
})
export class NewProposalSpaceAvailabilityComponent implements OnInit {
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

  proposalExtraDetailForm = new FormGroup({
    consolidated: new FormControl(''),
    Tenure: new FormControl('', Validators.required),
    LockIn: new FormControl('', Validators.required),
    NonStandardRequirement: new FormControl(''),
    Serviced: new FormControl('', Validators.required),
    serviceCosts: new FormControl(''),
    finalOfferAmmount: new FormControl('')
  });

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private costService:CostService,
    private locationService: LocationService,
    private proposalService: ProposalService,
  ) {}

  onSubmit = () => {};

  ngOnInit(): void {
this.createCostServices();
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
    this.costService.getAllCosts().subscribe((res:any)=>{

      if(this.isServiced === true)
      {
        let servicedCostOfElectricity = res[0].costOfElectricity;
        let  servicedCostOfOps =  res[0].costOfOPS
        // calculation Start of cost service
        let standarCost = 2000.00;
        let years3Rent =(standarCost/36)*1.12;
        let total_1 = years3Rent + servicedCostOfElectricity + servicedCostOfOps + this.rentValue + this.camValue;
        let adminMarketing = total_1*0.05;
        let brokerage = total_1*0.07;
        let total_2 = total_1 + adminMarketing + brokerage;
        let profitBeforeTax = total_2*0.5;
        let total_3 = total_2 + profitBeforeTax;
        let rateOfInventoryOnLeaseArea = (22/0.7)*total_3;
        let includeCommonsAmeneities = rateOfInventoryOnLeaseArea * 1.1;
        let on80perDiversityFactor = includeCommonsAmeneities/0.8;
        let final = this.totalNumberofSeat *on80perDiversityFactor;
        this.proposalExtraDetailForm.patchValue({
          serviceCosts:on80perDiversityFactor.toFixed(2)
        });
        this.proposalExtraDetailForm.patchValue({
          finalOfferAmmount:final.toFixed(2)
        })
      }
      else
      {
        let servicedCostOfElectricity = res[1].costOfElectricity;
        let  servicedCostOfOps =  res[1].costOfOPS
        // calculation Start of cost service
        let standarCost = 2000.00;
        let years3Rent =(standarCost/36)*1.12;
        let total_1 = years3Rent + servicedCostOfElectricity + servicedCostOfOps + this.rentValue + this.camValue;
        let adminMarketing = total_1*0.05;
        let brokerage = total_1*0.07;
        let total_2 = total_1 + adminMarketing + brokerage;
        let profitBeforeTax = total_2*0.5;
        let total_3 = total_2 + profitBeforeTax;
        let rateOfInventoryOnLeaseArea = (22/0.7)*total_3;
        let includeCommonsAmeneities = rateOfInventoryOnLeaseArea * 1.1;
        let on80perDiversityFactor = includeCommonsAmeneities/0.8;
        let final = this.totalNumberofSeat *on80perDiversityFactor;
        this.proposalExtraDetailForm.patchValue({
          serviceCosts:on80perDiversityFactor.toFixed(2)
        })
        this.proposalExtraDetailForm.patchValue({
          finalOfferAmmount:final.toFixed(2)
        })
      }

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
    // this.router.navigate(['/']);
  });
  };

  createCostServices(){



  }



}
