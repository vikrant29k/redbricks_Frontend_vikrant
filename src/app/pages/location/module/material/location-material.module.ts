import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

const material = [
    MatIconModule,
    MatButtonModule
];

@NgModule({
    imports: [material],
    exports: [material]
})
export class LocationMaterialModule {}