import { NgModule } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";


const materials = [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule
]

@NgModule({
    imports: [materials],
    exports: [materials]
})
export class AdminLayoutMaterialModule {}