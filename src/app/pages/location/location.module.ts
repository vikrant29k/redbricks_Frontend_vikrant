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
import { DatePipe } from "@angular/common";
import { GenerateRackValueComponent } from './component/generate-rack-value/generate-rack-value.component';
import { ShowLayoutComponent } from './component/show-layout/show-layout.component';
import { ShowGalleryComponent } from './component/show-gallery/show-gallery.component';
import { FloorsComponent } from './component/floors/floors.component';
import { LayoutEditorComponent } from './component/layout-editor/layout-editor.component';
import { LockLayoutEditorComponent } from "./component/locking the layout/locking the layout-editor.component";
@NgModule({
    declarations: [
        LocationComponent,
        LocationLocationComponent,
        LocationCenterComponent,
        LocationLocationDetailComponent,
        AddLocationComponent,
        LocationListComponent,
        GenerateRackValueComponent,
        ShowLayoutComponent,
        ShowGalleryComponent,
        FloorsComponent,
        LayoutEditorComponent,
        LockLayoutEditorComponent
    ],
    imports: [
        CommonModule,
        LocationRoutingModule,
        LocationMaterialModule,
        ReactiveFormsModule
    ],
    providers: [
        LocationAdminChildRouteGuard,
        DatePipe,
        LocationSalesChildRouteGuard
    ]
})
export class LocationModule { }
