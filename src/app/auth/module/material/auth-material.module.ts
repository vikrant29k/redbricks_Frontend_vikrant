import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

const material = [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
];

@NgModule({
    imports: [material],
    exports: [material]
})
export class AuthMaterialModule {}