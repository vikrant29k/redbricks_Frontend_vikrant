import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddLocationComponent } from "../../component/add-location/add-location.component";
import { LocationCenterComponent } from "../../component/center/center.component";
import { LocationLocationDetailComponent } from "../../component/location-detail/location-detail.component";
import { LocationListComponent } from "../../component/location-list/location-list.component";
import { LocationLocationComponent } from "../../component/location/location.component";
import { LocationComponent } from "../../location.component";

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
                component: LocationLocationComponent
            },
            {
                path: 'center',
                component: LocationCenterComponent
            },
            {
                path: 'location-detail',
                component: LocationLocationDetailComponent
            },
            {
                path: 'location-list',
                component: LocationListComponent
            },
            {
                path: 'add-location',
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