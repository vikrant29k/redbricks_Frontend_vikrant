import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';
import { DiagramRoutingModule } from './modules/routing/diagram.routing';
import { DrawDiagramComponent } from './component/draw-diagram/draw-diagram.component';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    DiagramComponent,
    DrawDiagramComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DiagramRoutingModule
  ]
})
export class DiagramModule { }
