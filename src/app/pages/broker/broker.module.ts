import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BrokerRoutingModule } from "./module/routing/broker-routing.module";
import { BrokerComponent } from "./broker.component";
import { BrokerAddBrokerComponent } from "./conponent/add-broker/add-broker.component";
import { BrokerMaterialMoudule } from "./module/material/broker-material.module";
import { BrokerBrokerListComponent } from "./conponent/broker-list/broker-list.component";
import { BrokerDetailsComponent } from './conponent/broker-details/broker-details.component';
import { DashboardModule } from "../dashboard/dashboard.module";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { UserService } from "src/app/service/users/user.service";
import { JWTService } from "src/app/service/jwt/jwt.service";
import { BrokerService } from "src/app/service/broker/broker.service";
import { GoogleChartsModule } from 'angular-google-charts';
// import { AdminDashboardExpandComponent } from "../dashboard/component/admin-dashboard-expand/admin-dashboard-expand.component";

@NgModule({
    declarations: [
        BrokerComponent,
        BrokerAddBrokerComponent,
        BrokerBrokerListComponent,
        BrokerDetailsComponent,
    ],
    imports: [
        CommonModule,
        BrokerRoutingModule,
        ReactiveFormsModule,
        BrokerMaterialMoudule,
        DashboardModule,
        GoogleChartsModule
    ],
    providers:[
        DashboardService,
        ProposalService,
        UserService,
        JWTService,
        BrokerService
    ]
})
export class BrokerModule {}