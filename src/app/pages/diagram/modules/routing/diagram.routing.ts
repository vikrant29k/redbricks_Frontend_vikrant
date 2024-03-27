import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DiagramComponent } from "../../diagram.component";
import { DrawDiagramComponent } from "../../component/draw-diagram/draw-diagram.component";
const routes: Routes = [
    {
        path: '',
        component: DiagramComponent,
        children:[
          {
            path: '',
            redirectTo: 'draw-diagram',
            pathMatch: 'full'
        },
          {
            path: 'draw-diagram',
            component: DrawDiagramComponent
        }
        ]

    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DiagramRoutingModule {}
