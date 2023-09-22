import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from '@angular/material/expansion'
import {MatTooltipModule}   from '@angular/material/tooltip'
import { MatRippleModule  } from "@angular/material/core";
import {MatBadgeModule} from "@angular/material/badge"
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule } from "@angular/forms";
const material = [
    MatTableModule,
    FormsModule,
    MatBadgeModule,
    MatRippleModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
   MatCardModule,
    MatPaginatorModule,
    MatSortModule,

    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
   MatDialogModule,
   MatIconModule,
   DragDropModule

];

@NgModule({
    imports: [material],
    exports: [material]
})
export class DashboardMaterialModule {}
