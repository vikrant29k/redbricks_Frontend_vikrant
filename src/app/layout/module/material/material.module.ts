import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule  } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";

const material: any = [
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule
]

@NgModule({
    imports: [material],
    exports: [material]
})
export class LayoutMaterialModule {}