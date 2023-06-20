import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CostService } from 'src/app/service/cost/cost.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LocationService } from 'src/app/service/location/location.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
export interface DialogData {
  rentCamTotal: any,
  locationData:any,
  locationId:any
}
@Component({
  selector: 'app-generate-rack-value',
  templateUrl: './generate-rack-value.component.html',
  styleUrls: ['./generate-rack-value.component.scss']
})
export class GenerateRackValueComponent implements OnInit {
  editMode: boolean = false;
  enableEdit(){
    this.editMode=!this.editMode
  }

  rackForm:any = new FormGroup<any>({
    systemPrice: new FormControl('', Validators.required),
    rackRate: new FormControl('', Validators.required),
    systemPriceNS: new FormControl('', Validators.required),
    rackRateNS: new FormControl('', Validators.required),
    costOfStandardInteriors: new FormControl('', Validators.required),
    amortizedFitOutRentFor3Years: new FormControl('', Validators.required),
    total_1: new FormControl('', Validators.required),
    adminMarketingAndOverHeads: new FormControl('', Validators.required),
    brokerage: new FormControl('', Validators.required),
    total_2: new FormControl('', Validators.required),
    profitBeforeTax: new FormControl('', Validators.required),
    total_3: new FormControl('', Validators.required),
    rateOfInventoryOnLeaseArea: new FormControl('', Validators.required),
    includeCommonsAmenities: new FormControl('', Validators.required),
    on80perDiversityFactor: new FormControl('', Validators.required),
    costOfElectricity:new FormControl('',Validators.required),
    costOfOps:new FormControl('',Validators.required),
  });

  systemValue:any;
  rackValue:any;
  systemValueNS:any;
  rackValueNS:any;
  locationId:any
  years3Rent:any;
  total_1:any;
  adminMarketing:any;
  brokerage:any;
  total_2:any;
  profitBeforeTax:any;
  total_3:any;
  rateOfInventoryOnLeaseArea:any;
  includeCommonsAmeneities:any;
  on80perDiversityFactor:any;
  costStandardInteriors:any;
  costOfElectricity:any;
  costOfOps:any;

calculatePercent:any;
brokeragePercent:any;
profitBeforeTaxPercent:any;
  constructor(private costService: CostService,
    private router: Router,
              private locationService: LocationService,
    public dialogRef: MatDialogRef<GenerateRackValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    getcostfromService(){
        this.costOfElectricity=15;
        this.costOfOps=10;
        this.costStandardInteriors=2000
       this.years3Rent =(this.costStandardInteriors/36)*1.12;
       this.total_1 =  this.years3Rent + this.costOfElectricity + this.costOfOps + this.data.rentCamTotal;
       this.adminMarketing =  this.total_1*0.05;
       this.calculatePercent = ((this.adminMarketing/this.total_1)*100).toFixed(2);

       this.brokerage =  this.total_1*0.07;
       this.brokeragePercent = ((this.brokerage/this.total_1)*100).toFixed(2);
       this.total_2 = this. total_1 + this. adminMarketing + this. brokerage;
       this.profitBeforeTax =  this.total_2*0.5;
       this.profitBeforeTaxPercent=(( this.profitBeforeTax/this.total_2)*100).toFixed(2);
       this.total_3 =  this.total_2 +  this.profitBeforeTax;
       this.rateOfInventoryOnLeaseArea = (22/0.7)* this.total_3;
       this.includeCommonsAmeneities =  this.rateOfInventoryOnLeaseArea * 1.1;
       this.on80perDiversityFactor =  this.includeCommonsAmeneities/0.8;
        this.systemValue = Math.round( this.on80perDiversityFactor) ;
        this.rackValue = (Math.ceil( this.on80perDiversityFactor/1000)*1000) +1000;
        console.log(this.systemValue,"asdasd", this.rackValue)
        this.patchValueFunction( this.rackValue.toFixed(2),this.systemValue.toFixed(2),this.costStandardInteriors.toFixed(2), this.years3Rent.toFixed(2),this.total_1.toFixed(2),this.adminMarketing.toFixed(2),this.brokerage.toFixed(2),this.total_2.toFixed(2),this.profitBeforeTax.toFixed(2),this.total_3.toFixed(2) ,this.rateOfInventoryOnLeaseArea.toFixed(2),this.includeCommonsAmeneities.toFixed(2),this.on80perDiversityFactor.toFixed(2),this.costOfElectricity.toFixed(2),this.costOfOps.toFixed(2))
    }
  ngOnInit(): void {

    this.getcostfromService();
    this.watchFormValue();
    console.log(this.rackValue,"Cost function")
  }
patchValueFunction(rackRate:any,
    systemPrice: any,
    costOfStandardInteriors:any,
    amortizedFitOutRentFor3Years:  any,
    total_1: any,
    adminMarketingAndOverHeads:  any,
    brokerage: any,
    total_2: any,
    profitBeforeTax:any,
    total_3:  any,
    rateOfInventoryOnLeaseArea:  any,
    includeCommonsAmenities:  any,
    on80perDiversityFactor:  any,
    costOfElectricity: any ,
    costOfOps: any){
      console.log(this.rackValue,"Patch function")
  this.rackForm.patchValue({
    rackRate: rackRate ,
    systemPrice: systemPrice,
    costOfStandardInteriors:costOfStandardInteriors,
    amortizedFitOutRentFor3Years:  amortizedFitOutRentFor3Years,
    total_1: total_1,
    adminMarketingAndOverHeads:  adminMarketingAndOverHeads,
    brokerage: brokerage,
    total_2: total_2,
    profitBeforeTax: profitBeforeTax,
    total_3:  total_3,
    rateOfInventoryOnLeaseArea:  rateOfInventoryOnLeaseArea,
    includeCommonsAmenities:  includeCommonsAmenities,
    on80perDiversityFactor:  on80perDiversityFactor,
    costOfElectricity: costOfElectricity ,
    costOfOps: costOfOps
  });
}

watchFormValue = () => {
  this.rackForm.valueChanges?.subscribe((value: any) => {
    const costOfStandardInteriors = value.costOfStandardInteriors;
    const costOfElectricity = value.costOfElectricity;
    const adminMarketing = value.adminMarketingAndOverHeads;
    const borkerage = value.brokerage;
    const amortizedFitOutRentFor3Years = value.amortizedFitOutRentFor3Years;
    const costOfOps = value.costOfOps;
    const profitBeforeTax = value.profitBeforeTax

    this.years3Rent = (costOfStandardInteriors / 36) * 1.12;
    this.total_1 = this.years3Rent + costOfElectricity + costOfOps + this.data.rentCamTotal;
    this.adminMarketing = this.total_1 * 0.05;
    this.calculatePercent = ((adminMarketing/this.total_1)*100).toFixed(2)
    this.brokerage = this.total_1 * 0.07;
    this.brokeragePercent = ((borkerage/this.total_1)*100).toFixed(2);
    this.total_2 = this.total_1 + this.brokerage + adminMarketing;
    this.profitBeforeTax = this.total_2 * 0.5;
    this.profitBeforeTaxPercent=(( profitBeforeTax/this.total_2)*100).toFixed(2);
    this.total_3 = this.total_2 + profitBeforeTax;
    this.rateOfInventoryOnLeaseArea = (22 / 0.7) * this.total_3;
    this.includeCommonsAmeneities = this.rateOfInventoryOnLeaseArea * 1.1;
    this.on80perDiversityFactor = this.includeCommonsAmeneities / 0.8;
    this.systemValue = Math.round(this.on80perDiversityFactor);
    const newRackValue = (Math.ceil(this.on80perDiversityFactor / 1000) * 1000) + 1000;

    if (this.rackValue !== newRackValue) {
      this.rackValue = newRackValue.toFixed(2);
      this.costOfElectricity = costOfElectricity.toFixed(2);
      this.costOfOps = costOfOps.toFixed(2);
      this.adminMarketing = adminMarketing.toFixed(2);
      this.brokerage = borkerage.toFixed(2)
      this.profitBeforeTax=profitBeforeTax.toFixed(2);
      this.patchValueFunction(
        this.rackValue.toFixed(2),
        this.systemValue,
        costOfStandardInteriors.toFixed(2),
        this.years3Rent.toFixed(2),
        this.total_1.toFixed(2),
        this.adminMarketing.toFixed(2),
        this.brokerage.toFixed(2),
        this.total_2.toFixed(2),
        this.profitBeforeTax.toFixed(2),
        this.total_3.toFixed(2),
        this.rateOfInventoryOnLeaseArea.toFixed(2),
        this.includeCommonsAmeneities.toFixed(2),
        this.on80perDiversityFactor.toFixed(2),
        this.costOfElectricity.toFixed(2),
        this.costOfOps.toFixed(2)
      );
    }

    // Patch other calculated values to the form
    this.rackForm.patchValue({
      years3Rent: this.years3Rent,
      total_1: this.total_1,
      adminMarketing: this.adminMarketing,
      brokerage: this.brokerage,
      total_2: this.total_2,
      profitBeforeTax: this.profitBeforeTax,
      total_3: this.total_3,
      rateOfInventoryOnLeaseArea: this.rateOfInventoryOnLeaseArea,
      includeCommonsAmeneities: this.includeCommonsAmeneities,
      on80perDiversityFactor: this.on80perDiversityFactor
    });
  });
}





  confirmation(){
   let formData = {
    ...this.data.locationData,
    ...this.rackForm.value
   }
   console.log("asdasdasdasdasdas", this.rackValue)
   let data= {
    _id:formData._id||this.data.locationId,
    rackRate: this.rackValue,
    systemPrice: this.systemValue,
    systemPriceNS:this.systemValueNS,
    rackRateNS:this.rackValueNS,
    costOfStandardInteriors:this.rackForm.value.costOfStandardInteriors,
    amortizedFitOutRentFor3Years:this.rackForm.value.amortizedFitOutRentFor3Years,
    total_1:this.rackForm.value.total_1,
    adminMarketingAndOverHeads:this.rackForm.value.adminMarketingAndOverHeads,
    brokerage:this.rackForm.value.brokerage,
    total_2:this.rackForm.value.total_2,
    profitBeforeTax:this.rackForm.value.profitBeforeTax,
    total_3:this.rackForm.value.total_3,
    rateOfInventoryOnLeaseArea:this.rackForm.value.rateOfInventoryOnLeaseArea,
    includeCommonsAmenities:this.rackForm.value.includeCommonsAmenities,
    on80perDiversityFactor:this.rackForm.value.on80perDiversityFactor,
    costOfElectricity: this.rackForm.value.costOfElectricity ,
    costOfOps: this.rackForm.value.costOfOps
   }
    this.locationService.addRackValue(data).subscribe({
      next: (result: any) => {
        this.dialogRef.close();
      }
    });
  }
}
