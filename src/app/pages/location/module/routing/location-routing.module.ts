import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddLocationComponent } from "../../component/add-location/add-location.component";
import { LocationCenterComponent } from "../../component/center/center.component";
import { LocationLocationDetailComponent } from "../../component/location-detail/location-detail.component";
import { LocationListComponent } from "../../component/location-list/location-list.component";
import { LocationLocationComponent } from "../../component/location/location.component";
import { LocationComponent } from "../../location.component";
import { LocationAdminChildRouteGuard } from "../service/location-admin-child-route/location-child-admin-route-guard.guard";
import { LocationSalesChildRouteGuard } from "../service/location-sales-child-route/location-sales-child-route.guard";

const routes: Routes = [
    {
        path: '',
        component: LocationComponent,
        children: [
            {
                path: '',
                redirectTo: 'location',
                pathMatch: 'full'
            },
            {
                path: 'location',
                canActivate: [LocationSalesChildRouteGuard],
                component: LocationLocationComponent
            },
            {
                path: 'center/:location',
                canActivate: [LocationSalesChildRouteGuard],
                component: LocationCenterComponent
            },
            {
                path: 'location-detail/:Id',
                component: LocationLocationDetailComponent
            },
            {
                path: 'location-list',
                canActivate: [LocationAdminChildRouteGuard],
                component: LocationListComponent
            },
            {
                path: 'add-location',
                canActivate: [LocationAdminChildRouteGuard],
                component: AddLocationComponent
            },
            {
                path: 'edit-location/:Id',
                canActivate: [LocationAdminChildRouteGuard],
                component: AddLocationComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class LocationRoutingModule { }