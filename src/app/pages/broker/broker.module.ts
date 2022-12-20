import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BrokerRoutingModule } from "./module/routing/broker-routing.module";
import { BrokerComponent } from "./broker.component";
import { BrokerAddBrokerComponent } from "./conponent/add-broker/add-broker.component";
import { BrokerMaterialMoudule } from "./module/material/broker-material.module";
import { BrokerBrokerListComponent } from "./conponent/broker-list/broker-list.component";

@NgModule({
    declarations: [
        BrokerComponent,
        BrokerAddBrokerComponent,
        BrokerBrokerListComponent
    ],
    imports: [
        CommonModule,
        BrokerRoutingModule,
        ReactiveFormsModule,
        BrokerMaterialMoudule
    ],
})
export class BrokerModule {}