import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CostService } from "src/app/service/cost/cost.service";
import { CalculationDataService } from "src/app/service/Calculate Data/calculation-data.service";
import { Router } from '@angular/router';
@Component({
    selector: 'cost-update-cost',
    templateUrl: './update-cost.component.html',
    styleUrls: ['./update-cost.component.scss']
})
export class CostUpdateCostComponent implements OnInit {
  enableEdit(){
    this.editMode=!this.editMode
  }
    editMode: boolean = false;
    brokerId!: string;

    costForm = new FormGroup({
        'costStandardInteriors':new FormControl(),
        'costOfElectricity': new FormControl(),
        'costOfOPS': new FormControl(),
    });

    constructor(
        private costService: CostService,
        private calculate:CalculationDataService,
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
      // this.calculate.objectValueUpdated.subscribe(res=>{
      //   // alert('got value'+res)
      //   console.log('Cost sheet ts',res)

      // })
    }
    routeToList(){
      this.route.navigateByUrl('/admin/cost/view-list')
    }

    onSubmit = () => {

      this.costService.updateCosts(this.costForm.value).subscribe({
        next: (result: unknown) => {
          console.log('Successfully Updated',result);
        }

      })
    }

}
