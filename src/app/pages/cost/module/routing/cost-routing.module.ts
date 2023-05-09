import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CostComponent } from "../../cost.component";
import { CostUpdateCostComponent } from "../../component/update-cost/update-cost.component";
import { ViewListComponent } from "../../component/view-list/view-list.component";



const routes: Routes = [
    {
        path: '',
        component: CostComponent,
        children: [
            {
                path: '',
                redirectTo: 'update-cost',
                pathMatch: 'full'
            },
            {
                path: 'update-cost',
                component: CostUpdateCostComponent
            },
            {
              path: 'view-list',
              component : ViewListComponent
            }
            // {
            //     path: 'update-cost/:brokerId',
            //     component: CostUpdateCostComponent
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrokerRoutingModule {}
