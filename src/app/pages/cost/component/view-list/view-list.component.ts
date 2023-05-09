import { Component,OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CostService } from "src/app/service/cost/cost.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {

  editMode: boolean = false;
  brokerId!: string;

  costForm = new FormGroup({
      'costOfElectricity': new FormControl(),
      'costOfOPS': new FormControl(),
      'servicedOrNonService':new FormControl(),
      'costStandardInteriors':new FormControl(),
      'amortizedFitOutRent3Years':new FormControl(),
      'realEstateRent':new FormControl(),
      'CAM':new FormControl(),
      'adminMarketing':new FormControl(),
      'total_1':new FormControl(),
      'brokerage':new FormControl(),
      'total_2':new FormControl(),
      'profitBeforeTax':new FormControl(),
      'total_3':new FormControl(),
      'includeCommonsAmenities':new FormControl(),
      'on80perDiversityFactor':new FormControl(),
      'rateOfInventoryOnLeaseArea':new FormControl(),
  });

  constructor(
      private costService: CostService,
      private route: Router
  ) { }

  ngOnInit(): void {
    this.costService.getAllCosts().subscribe((res:any)=>{
      console.log(res)
      console.log(res[0].servicedOrNonService )
      if(res[0].servicedOrNonService === 'yes'){
      // this.costForm.value.costOfElectricity = res[0].costOfElectricity;
      // this.costForm.value.costOfOPS = res[0].costOfOPS;
      this.costForm.patchValue(res[0])
      }

    })

  }
  routeToList(){
    this.route.navigateByUrl('/admin/cost/view-list')
  }

  enableEdit(){
    this.editMode=!this.editMode
  }
  onSubmit = () => {

    this.costService.updateCosts(this.costForm.value).subscribe({
      next: (result: unknown) => {
        console.log('Successfully Updated',result);
      }

    })
  }

}
