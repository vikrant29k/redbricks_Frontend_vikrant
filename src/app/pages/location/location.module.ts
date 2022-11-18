import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LocationCenterComponent } from "./component/center/center.component";
import { LocationLocationDetailComponent } from "./component/location-detail/location-detail.component";
import { LocationLocationComponent } from "./component/location/location.component";
import { LocationComponent } from "./location.component";
import { LocationMaterialModule } from "./module/material/location-material.module";
import { LocationRoutingModule } from "./module/routing/location-routing.module";
import { AddLocationComponent } from './component/add-location/add-location.component';
import { LocationListComponent } from './component/location-list/location-list.component';
import { LocationAdminChildRouteGuard } from "./module/service/location-admin-child-route/location-child-admin-route-guard.guard";
import { LocationSalesChildRouteGuard } from "./module/service/location-sales-child-route/location-sales-child-route.guard";
@NgModule({
    declarations: [
        LocationComponent,
        LocationLocationComponent,
        LocationCenterComponent,
        LocationLocationDetailComponent,
        AddLocationComponent,
        LocationListComponent
    ],
    imports: [
        CommonModule,
        LocationRoutingModule,
        LocationMaterialModule,
        ReactiveFormsModule
    ],
    providers: [
        LocationAdminChildRouteGuard,
        LocationSalesChildRouteGuard
    ]
})
export class LocationModule { }