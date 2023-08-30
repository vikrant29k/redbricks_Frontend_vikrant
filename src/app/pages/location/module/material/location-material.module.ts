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
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatRadioModule} from '@angular/material/radio';
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

const material = [
    MatTableModule,
    FormsModule,
    PdfViewerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
   MatDialogModule,
   MatIconModule,MatRadioModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatDatepickerModule,
   MatMomentDateModule

];

@NgModule({
    imports: [material],
    exports: [material]
})
export class LocationMaterialModule {}
