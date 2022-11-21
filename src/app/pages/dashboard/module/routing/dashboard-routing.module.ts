import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardAdminDashboard } from "../../component/admin-dashboard/admin-dashboard.component";
import { DashboardSalesDashboardComponent } from "../../component/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "../../dashboard.component";
import { DashboardAdminChildRouteGuard } from "../service/dashboard-admin-child-route/dashboard-admin-child-route-guard.guard";
import { DashboardSalesChildRouteGuard } from "../service/dashboard-sales-child-route/dashboard-sales-child-route.guard";

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'admin-dashboard',
                pathMatch: 'full'
            },
            {
                path: 'sales-dashboard',
                canActivate: [DashboardSalesChildRouteGuard],
                component: DashboardSalesDashboardComponent
            },
            {
                path: 'admin-dashboard',
                canActivate: [DashboardAdminChildRouteGuard],
                component: DashboardAdminDashboard
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }