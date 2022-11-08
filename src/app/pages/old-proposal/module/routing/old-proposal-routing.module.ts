import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClosureComponent } from "../../component/conflict/closure.component";
import { OldProposalTableComponent } from "../../component/old-proposal-table/old-proposal-table.component";
import { OldProposalComponent } from "../../old-proposal.component";

const routes: Routes = [
    {
        path: '',
        component: OldProposalComponent,
        children: [
            {
                path: '',
                redirectTo: 'old-proposal-table',
                pathMatch: 'full'
            },
            {
                path: 'closure/:Id',
                component: ClosureComponent
            },
            {
                path: 'old-proposal-table',
                component: OldProposalTableComponent
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