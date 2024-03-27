import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminLayoutRoutingModule } from "./module/routing/admin-layout-routing.module";
import { AdminLayoutContentComponent } from "./component/content/content.component";
import { AdminLayoutSidebarComponent } from "./component/sidebar/sidebar.component";
import { AdminLayoutMaterialModule } from "./module/material/admin-layout-material.module";
import { ReportDialogComponent } from './component/report-dialog/report-dialog.component';

@NgModule({
    declarations: [
        AdminLayoutComponent,
        AdminLayoutContentComponent,
        AdminLayoutSidebarComponent,
        ReportDialogComponent
    ],
    imports: [
        CommonModule,
        AdminLayoutRoutingModule,
        AdminLayoutMaterialModule
    ]
})
export class AdminLayoutModule {}
