import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CostService } from "src/app/service/cost/cost.service";
import { OnInit } from "@angular/core";

@Component({
    selector: 'cost-update-cost',
    templateUrl: './update-cost.component.html',
    styleUrls: ['./update-cost.component.scss']
})
export class CostUpdateCostComponent implements OnInit {

    editMode: boolean = false;
    brokerId!: string;

    costForm = new FormGroup({
        'costOfElectricity': new FormControl(),
        'costOfOPS': new FormControl(),
    });

    constructor(
        private costService: CostService,
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

    onSubmit = () => {

      this.costService.updateCosts(this.costForm.value).subscribe({
        next: (result: unknown) => {
          console.log('Successfully Updated',result);
        }

      })
    }

}
