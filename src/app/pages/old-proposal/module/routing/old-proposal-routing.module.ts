import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClosureComponent } from "../../component/conflict/closure.component";
import { OldProposalComponent } from "../../old-proposal.component";

const routes: Routes = [
    {
        path: '',
        component: OldProposalComponent,
        children: [
            {
                path: '',
                redirectTo: 'closure',
                pathMatch: 'full'
            },
            {
                path: 'closure',
                component: ClosureComponent
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
export class OldProposalRoutingModule {}