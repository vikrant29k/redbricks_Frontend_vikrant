import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardAdminDashboard } from "../../component/admin-dashboard/admin-dashboard.component";
import { DashboardSalesDashboardComponent } from "../../component/sales-dashboard/sales-dashboard.component";
import { DashboardComponent } from "../../dashboard.component";
import { DashboardChildRouteGuard } from "../service/dashboard-child-route-guard.service";

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
                component: DashboardSalesDashboardComponent
            },
            {
                path: 'admin-dashboard',
                canActivate: [DashboardChildRouteGuard],
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