import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LocationCenterComponent } from "./component/center/center.component";
import { LocationLocationDetailComponent } from "./component/location-detail/location-detail.component";
import { LocationLocationComponent } from "./component/location/location.component";
import { LocationComponent } from "./location.component";
import { LocationMaterialModule } from "./module/material/location-material.module";
import { LocationRoutingModule } from "./module/routing/location-routing.module";

@NgModule({
    declarations: [
        LocationComponent,
        LocationLocationComponent,
        LocationCenterComponent,
        LocationLocationDetailComponent
    ],
    imports: [
        CommonModule,
        LocationRoutingModule,
        LocationMaterialModule
    ]
})
export class LocationModule { }