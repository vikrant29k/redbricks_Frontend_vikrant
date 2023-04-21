import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BrokerRoutingModule } from "./module/routing/cost-routing.module";
import { CostComponent } from "./cost.component";
import { CostUpdateCostComponent } from "./component/update-cost/update-cost.component";
import {  CostMaterialMoudule} from "./module/material/cost-material.module";


@NgModule({
    declarations: [
        CostComponent,
        CostUpdateCostComponent,
    ],
    imports: [
        CommonModule,
        BrokerRoutingModule,
        ReactiveFormsModule,
        CostMaterialMoudule
    ],
})
export class CostModule {}
