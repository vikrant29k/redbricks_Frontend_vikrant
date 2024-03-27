import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClosureComponent } from "../../component/conflict/closure.component";
import { OldProposalTableComponent } from "../../component/old-proposal-table/old-proposal-table.component";
import { OldProposalComponent } from "../../old-proposal.component";
import { AddOldClientComponent } from "../../component/add-old-client/add-old-client.component";
import { OldClientListComponent } from "../../component/old-client-list/old-client-list.component";
import { PreviewLayoutAllclientsComponent } from "../../component/old-client-list/preview-layout-allclients/preview-layout-allclients.component";

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
            },
            {
                path:'add-old-client',
                component:AddOldClientComponent
            },
            {
                path:'old-client-list',
                component:OldClientListComponent
            },
            {
                path:'preview-all/:Id',
                component:PreviewLayoutAllclientsComponent
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