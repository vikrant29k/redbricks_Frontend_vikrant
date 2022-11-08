import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LayoutContentComponent } from "./component/content/content.component";
import { LayoutHeaderComponent } from "./component/header/header.component";
import { LayoutComponent } from "./layout.component";
import { LayoutMaterialModule } from "./module/material/material.module";
import { LayoutRoutingModule } from "./module/routing/layout-routing.module";

@NgModule({
    declarations: [
        LayoutComponent,
        LayoutContentComponent,
        LayoutHeaderComponent
    ],
    imports: [
        CommonModule,
        LayoutRoutingModule,
        LayoutMaterialModule
    ],
    exports: []
})
export class LayoutModule {}