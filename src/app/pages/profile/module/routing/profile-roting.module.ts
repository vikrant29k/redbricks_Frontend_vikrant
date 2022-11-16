import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileProfileDetailComponent } from "../../component/profile-detail/profile-detail.component";
import { ProfileComponent } from "../../profile.component";

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        children: [
            {
                path: '',
                redirectTo: 'detail',
                pathMatch: 'full'
            },
            {
                path: 'detail',
                component: ProfileProfileDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRouterModule {}