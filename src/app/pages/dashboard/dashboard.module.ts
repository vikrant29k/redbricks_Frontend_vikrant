import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardAdminDashboard } from "./component/admin-dashboard/admin-dashboard.component";
import { DashboardSalesDashboardComponent } from "./component/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./module/routing/dashboard-routing.module";
import { DashboardAdminChildRouteGuard } from "./module/service/dashboard-admin-child-route/dashboard-admin-child-route-guard.guard";
import { DashboardSalesChildRouteGuard } from "./module/service/dashboard-sales-child-route/dashboard-sales-child-route.guard";
import { DashboardMaterialModule } from "./module/material/dashboard-material.module";
import { AdminDashboardExpandComponent } from './component/admin-dashboard-expand/admin-dashboard-expand.component';
import { ShowStatsComponent } from './component/admin-dashboard-expand/show-stats/show-stats.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ShowChartComponent } from './component/admin-dashboard/show-chart/show-chart.component';
import { SalesHeadApprovalComponent } from './component/admin-dashboard/sales-head-approval/sales-head-approval.component';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IndianNumberPipe } from "./component/admin-dashboard/sales-head-approval/india-number.pipe";

@NgModule({
    declarations: [
      IndianNumberPipe,
        DashboardComponent,
        DashboardSalesDashboardComponent,
        DashboardAdminDashboard,
        AdminDashboardExpandComponent,
        ShowStatsComponent,
        ShowChartComponent,
        SalesHeadApprovalComponent
    ],
    imports: [
        CommonModule,
        GoogleChartsModule,
        // BrowserAnimationsModule,
        DashboardMaterialModule,
        DashboardRoutingModule
    ],
    providers: [
        DashboardAdminChildRouteGuard,
        DashboardSalesChildRouteGuard
    ],
    exports:[
        AdminDashboardExpandComponent,
        DashboardAdminDashboard
    ]
})
export class DashboardModule {}
