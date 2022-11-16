import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ProfileRouterModule } from "./module/routing/profile-roting.module";
import { ProfileProfileDetailComponent } from "./component/profile-detail/profile-detail.component";
import { ProfileMaterialModule } from "./module/material/profile-material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileProfileDetailComponent
    ],
    imports: [
        CommonModule,
        ProfileRouterModule,
        ProfileMaterialModule,
        ReactiveFormsModule
    ]
})
export class ProfileModule {}