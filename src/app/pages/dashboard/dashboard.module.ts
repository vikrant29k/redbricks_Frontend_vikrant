import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardAdminDashboard } from "./component/admin-dashboard/admin-dashboard.component";
import { DashboardSalesDashboardComponent } from "./component/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./module/routing/dashboard-routing.module";
import { DashboardChildRouteGuard } from "./module/service/dashboard-child-route-guard.service";

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardSalesDashboardComponent,
        DashboardAdminDashboard
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule
    ],
    providers: [
        DashboardChildRouteGuard
    ]
})
export class DashboardModule {}