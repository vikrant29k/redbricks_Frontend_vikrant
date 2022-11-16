import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminRouting } from "src/app/pages/admin-routing";
import { AdminLayoutComponent } from "../../admin-layout.component";

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: AdminRouting
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminLayoutRoutingModule {}