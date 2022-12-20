import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrokerComponent } from "../../broker.component";
import { BrokerAddBrokerComponent } from "../../conponent/add-broker/add-broker.component";
import { BrokerBrokerListComponent } from "../../conponent/broker-list/broker-list.component";


const routes: Routes = [
    {
        path: '',
        component: BrokerComponent,
        children: [
            {
                path: '',
                redirectTo: 'add-broker',
                pathMatch: 'full'
            },
            {
                path: 'add-broker',
                component: BrokerAddBrokerComponent
            },
            {
                path: 'broker-list',
                component: BrokerBrokerListComponent
            },
            {
                path: 'update-borker/:brokerId',
                component: BrokerAddBrokerComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrokerRoutingModule {}