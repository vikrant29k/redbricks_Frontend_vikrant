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
import { ShowLayoutComponent } from "../../component/show-layout/show-layout.component";
import { ShowGalleryComponent } from "../../component/show-gallery/show-gallery.component";
import { FloorsComponent } from "../../component/floors/floors.component";
import { LayoutEditorComponent } from "../../component/layout-editor/layout-editor.component";
import { LockLayoutEditorComponent } from "../../component/locking the layout/locking the layout-editor.component";
import { PreviewSeatsComponent } from "../../component/layout-editor/preview-seats/preview-seats.component";
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
              path: 'floor/:center',
              canActivate: [LocationSalesChildRouteGuard],
              component: FloorsComponent
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
            },
               {
                path:'layout-editor/:Id',
                canActivate:[LocationAdminChildRouteGuard],
                component:LayoutEditorComponent
            },
            {
                path:'lock-layout/:proposalId',
                component:LockLayoutEditorComponent
            },
            {
              path:'show-layout/:Id',
              canActivate:[LocationSalesChildRouteGuard],
              component:ShowLayoutComponent
            },
            {
              path:'show-gallery/:Id',
              canActivate:[LocationSalesChildRouteGuard],
              component:ShowGalleryComponent
            },
            {
              path:'preview-seats/:Id',
              component:PreviewSeatsComponent
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
