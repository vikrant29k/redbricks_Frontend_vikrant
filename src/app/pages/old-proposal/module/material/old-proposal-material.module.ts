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
import {MatTooltipModule} from "@angular/material/tooltip"
import {MatCardModule} from "@angular/material/card"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatRadioModule} from '@angular/material/radio';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
const material = [
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatRadioModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule
];

@NgModule({
    imports: [material],
    exports: [material]
})
export class OldProposalMaterialModule {}
