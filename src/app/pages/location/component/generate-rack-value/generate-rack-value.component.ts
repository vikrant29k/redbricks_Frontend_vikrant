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

  rackForm = new FormGroup<any>({
    systemPrice: new FormControl('', Validators.required),
    rackRate: new FormControl('', Validators.required),
    systemPriceNS: new FormControl('', Validators.required),
    rackRateNS: new FormControl('', Validators.required)
  });

  systemValue:any;
  rackValue:any;
  systemValueNS:any;
  rackValueNS:any;
  locationId:any
  constructor(private costService: CostService,
    private router: Router,
              private locationService: LocationService,
    public dialogRef: MatDialogRef<GenerateRackValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

  ngOnInit(): void {

    this.costService.getAllCosts().subscribe((res:any)=>{
      let years3RentNS =(res[0].costStandardInteriors/36)*1.12;
      let total_1NS = years3RentNS + 0 + 0 + this.data.rentCamTotal;
      let adminMarketingNS = total_1NS*0.05;
      let brokerageNS = total_1NS*0.07;
      let total_2NS = total_1NS + adminMarketingNS + brokerageNS;
      let profitBeforeTaxNS = total_2NS*0.5;
      let total_3NS = total_2NS + profitBeforeTaxNS;
      let rateOfInventoryOnLeaseAreaNS = (22/0.7)*total_3NS;
      let includeCommonsAmeneitiesNS = rateOfInventoryOnLeaseAreaNS * 1.1;
      let on80perDiversityFactorNS = includeCommonsAmeneitiesNS/0.8;
      this.systemValueNS = Math.round(on80perDiversityFactorNS) ;
      this.rackValueNS = (Math.ceil(on80perDiversityFactorNS/1000)*1000) +1000;


      let years3Rent =(res[0].costStandardInteriors/36)*1.12;
      let total_1 = years3Rent + res[0].costOfElectricity + res[0].costOfOPS + this.data.rentCamTotal;
      let adminMarketing = total_1*0.05;
      let brokerage = total_1*0.07;
      let total_2 = total_1 + adminMarketing + brokerage;
      let profitBeforeTax = total_2*0.5;
      let total_3 = total_2 + profitBeforeTax;
      let rateOfInventoryOnLeaseArea = (22/0.7)*total_3;
      let includeCommonsAmeneities = rateOfInventoryOnLeaseArea * 1.1;
      let on80perDiversityFactor = includeCommonsAmeneities/0.8;
      this.systemValue = Math.round(on80perDiversityFactor) ;
      this.rackValue = (Math.ceil(on80perDiversityFactor/1000)*1000) +1000;
      console.log(this.systemValue,"asdasd", this.rackValue)
      this.rackForm.patchValue({
        rackRate: this.rackValue,
        systemPrice: this.systemValue,
        systemPriceNS:this.systemValueNS,
        rackRateNS:this.rackValueNS
      });
    })
  }

  confirmation(){
   let formData = {
    ...this.data.locationData,
    ...this.rackForm.value
   }
   let data= {
    _id:formData._id||this.data.locationId,
    rackRate: this.rackValue,
    systemPrice: this.systemValue,
    systemPriceNS:this.systemValueNS,
    rackRateNS:this.rackValueNS
   }
    this.locationService.addRackValue(data).subscribe({
      next: (result: any) => {
        this.dialogRef.close();
      }
    });
  }
}
