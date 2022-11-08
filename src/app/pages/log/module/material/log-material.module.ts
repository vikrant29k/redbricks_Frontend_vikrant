import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

const material = [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule
]

@NgModule({
    imports: [material],
    exports: [material]
})
export class LogMaterialMoudle {}