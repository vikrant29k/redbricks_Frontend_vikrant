import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CostService } from 'src/app/service/cost/cost.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LocationService } from 'src/app/service/location/location.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
export interface DialogData {
  rentCamTotal: any,
  formdata:any,
  locationData:any,
  locationId:any,
  editMode:any
}
@Component({
  selector: 'app-generate-rack-value',
  templateUrl: './generate-rack-value.component.html',
  styleUrls: ['./generate-rack-value.component.scss']
})
export class GenerateRackValueComponent implements OnInit {
  editMode: boolean = true;
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
    efficiency:new FormControl('',Validators.required),
  });

  systemValue!:number;
  rackValue!:number;
  systemValueNS!:number;
  rackValueNS!:number;
  locationId!:number
  years3Rent!:number;
  total_1!:number;
  adminMarketing!:number;
  brokerage!:number;
  total_2!:number;
  profitBeforeTax!:number;
  total_3!:number;
  rateOfInventoryOnLeaseArea!:number;
  includeCommonsAmeneities!:number;
  on80perDiversityFactor!:number;
  costStandardInteriors!:number;
  costOfElectricity!:number;
  costOfOps!:number;
  efficiency!:number;
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
        this.efficiency=0.68;
       this.years3Rent =(this.costStandardInteriors/36)*1.12;
       let  amortizedFitOutRentFor3Years = this.years3Rent;
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

        //non serviced values
        let nonServiceCalculation = Number((((amortizedFitOutRentFor3Years+this.data.rentCamTotal)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.05)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.07))*0.5)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.05)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.07)));
        let nonServiceROI = Number((22 / 0.7) * nonServiceCalculation);
        let nonServiceICA = Number(nonServiceROI *1.1);
        this.systemValueNS =Number(Math.round(nonServiceICA/0.8).toFixed(0));
        this.rackValueNS=(Math.ceil( this.systemValueNS/1000)*1000) +1000;
        this.patchValueFunction( Number(this.rackValue.toFixed(2)),Number(this.systemValue.toFixed(2)),Number(this.costStandardInteriors.toFixed(2)), Number(this.years3Rent.toFixed(2)),Number(this.total_1.toFixed(2)),Number(this.adminMarketing.toFixed(2)),Number(this.brokerage.toFixed(2)),Number(this.total_2.toFixed(2)),Number(this.profitBeforeTax.toFixed(2)),Number(this.total_3.toFixed(2)) ,Number(this.rateOfInventoryOnLeaseArea.toFixed(2)),Number(this.includeCommonsAmeneities.toFixed(2)),Number(this.on80perDiversityFactor.toFixed(2)),Number(this.costOfElectricity.toFixed(2)),this.costOfOps,this.rackValueNS,this.systemValueNS)

     }
  ngOnInit(): void {

    // console.log("Hello-===> Data",this.data.formdata,'Editmode=====>',this.data.editMode);
    if(this.data.editMode===true){
     this.patchWhenUpdate()
      console.log(this.rackForm.value);
    }else{
      this.getcostfromService();
    }


    this.watchFormValue();
    // console.log(this.rackValue,"Cost function")
  }
  patchWhenUpdate(){
    this.rackForm.patchValue({
      rackRate:this.data.formdata.rackRate ,
      systemPrice:this.data.formdata. systemPrice,
      rackRateNS:this.data.formdata.rackRateNS,
      systemPriceNS:this.data.formdata.systemPriceNS,
      costOfStandardInteriors:this.data.formdata.costOfStandardInteriors,
      amortizedFitOutRentFor3Years:this.data.formdata.amortizedFitOutRentFor3Years,
      total_1:this.data.formdata.total_1,
      adminMarketingAndOverHeads:this.data.formdata.adminMarketingAndOverHeads,
      brokerage:this.data.formdata.brokerage,
      total_2:this.data.formdata.total_2,
      profitBeforeTax:this.data.formdata.profitBeforeTax,
      total_3:this.data.formdata.total_3,
      rateOfInventoryOnLeaseArea:this.data.formdata.rateOfInventoryOnLeaseArea,
      includeCommonsAmenities:this.data.formdata.includeCommonsAmenities,
      on80perDiversityFactor:this.data.formdata.on80perDiversityFactor,
      costOfElectricity:this.data.formdata.costOfElectricity ,
      costOfOps:this.data.formdata.costOfOps,
      efficiency:this.data.formdata.efficiency
    });
  }
patchValueFunction(rackRate:number,
    systemPrice: number,
    costOfStandardInteriors:number,
    amortizedFitOutRentFor3Years:  number,
    total_1: number,
    adminMarketingAndOverHeads:  number,
    brokerage: number,
    total_2: number,
    profitBeforeTax:number,
    total_3:  number,
    rateOfInventoryOnLeaseArea:  number,
    includeCommonsAmenities:  number,
    on80perDiversityFactor:  number,
    costOfElectricity: number ,
    costOfOps: number,
    rackRateNS:number,
    systemPriceNS:number){
      // console.log(this.rackValue,"Patch function")
  this.rackForm.patchValue({
    rackRate: rackRate ,
    systemPrice: systemPrice,
    rackRateNS:rackRateNS,
    systemPriceNS:systemPriceNS,
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
    costOfOps: costOfOps,
    efficiency:this.efficiency
  });
}

watchFormValue = () => {
  this.rackForm.valueChanges.subscribe((value: any) => {
    const costOfStandardInteriors = value.costOfStandardInteriors;
    const costOfElectricity = value.costOfElectricity;
    const adminMarketing = value.adminMarketingAndOverHeads;
    const borkerage = value.brokerage;
    const amortizedFitOutRentFor3Years = value.amortizedFitOutRentFor3Years;
    const costOfOps = value.costOfOps;
    const profitBeforeTax = value.profitBeforeTax
    this.efficiency = value.efficiency
    this.years3Rent = Number(((costOfStandardInteriors / 36) * 1.12).toFixed(2));
    this.total_1 =(amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal).toFixed(2);
    // this.adminMarketing = (this.total_1 * 0.05).toFixed(2);
    this.adminMarketing = Number(((amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal)*0.05).toFixed(2))
    this.calculatePercent = ((adminMarketing/(amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal))*100).toFixed(2)
    this.brokerage = Number(((amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal) * 0.07).toFixed(2))
    this.brokeragePercent = ((borkerage/(amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal))*100).toFixed(2);
    this.total_2 = (amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal + borkerage + adminMarketing).toFixed(2);
    // this.profitBeforeTax = (this.total_2 * 0.5).toFixed(2);
    this.profitBeforeTax = Number(((amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal + borkerage + adminMarketing)*0.5).toFixed(2))
    this.profitBeforeTaxPercent=(( profitBeforeTax/(amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal + borkerage + adminMarketing))*100).toFixed(2);
    this.total_3 = (amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal + borkerage + adminMarketing + profitBeforeTax).toFixed(2);
    this.rateOfInventoryOnLeaseArea = Number(((22 / 0.7) * ((amortizedFitOutRentFor3Years + costOfElectricity + costOfOps + this.data.rentCamTotal + borkerage + adminMarketing + profitBeforeTax))).toFixed(2));
    this.includeCommonsAmeneities = Number((this.rateOfInventoryOnLeaseArea * 1.1).toFixed(2));
    this.on80perDiversityFactor = Number((this.includeCommonsAmeneities / 0.8).toFixed(2));
    this.systemValue = Number(Math.round(this.on80perDiversityFactor));
    const newRackValue = (Math.ceil(this.on80perDiversityFactor / 1000) * 1000) + 1000;
    this.rackValue = (Math.ceil( this.on80perDiversityFactor/1000)*1000) +1000;

    let nonServiceCalculation = Number((((amortizedFitOutRentFor3Years+this.data.rentCamTotal)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.05)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.07))*0.5)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.05)+((amortizedFitOutRentFor3Years+this.data.rentCamTotal)*0.07)));
    let nonServiceROI = Number((22 / 0.7) * nonServiceCalculation);
    let nonServiceICA = Number(nonServiceROI *1.1);
    this.systemValueNS =Number(Math.round(nonServiceICA/0.8).toFixed(0));
    this.rackValueNS=(Math.ceil( this.systemValueNS/1000)*1000) +1000;

  });
}





  confirmation(){
   let formData = {
    ...this.data.locationData,
    ...this.rackForm.value
   }
  //  console.log("asdasdasdasdasdas", this.rackValue)
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
    costOfOps: this.rackForm.value.costOfOps,
    efficiency:this.efficiency
   }
    this.locationService.addRackValue(data).subscribe({
      next: (result: any) => {
        this.dialogRef.close();
      }
    });
  }
}
