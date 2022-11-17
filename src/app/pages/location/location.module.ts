import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LocationCenterComponent } from "./component/center/center.component";
import { LocationLocationDetailComponent } from "./component/location-detail/location-detail.component";
import { LocationLocationComponent } from "./component/location/location.component";
import { LocationComponent } from "./location.component";
import { LocationMaterialModule } from "./module/material/location-material.module";
import { LocationRoutingModule } from "./module/routing/location-routing.module";
import { AddLocationComponent } from './component/add-location/add-location.component';
import { LocationListComponent } from './component/location-list/location-list.component';
import { LocationListService } from "src/app/service/location-list/location-list.service";
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
        LocationMaterialModule
    ]
})
export class LocationModule { }