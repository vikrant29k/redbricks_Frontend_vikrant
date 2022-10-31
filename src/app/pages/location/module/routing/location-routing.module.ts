import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LocationCenterComponent } from "../../component/center/center.component";
import { LocationLocationDetailComponent } from "../../component/location-detail/location-detail.component";
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