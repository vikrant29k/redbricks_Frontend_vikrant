import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardAdminDashboard } from "./component/admin-dashboard/admin-dashboard.component";
import { DashboardSalesDashboardComponent } from "./component/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./module/routing/dashboard-routing.module";
import { DashboardAdminChildRouteGuard } from "./module/service/dashboard-admin-child-route/dashboard-admin-child-route-guard.guard";
import { DashboardSalesChildRouteGuard } from "./module/service/dashboard-sales-child-route/dashboard-sales-child-route.guard";

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
        DashboardAdminChildRouteGuard,
        DashboardSalesChildRouteGuard
    ]
})
export class DashboardModule {}