import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewProposalClientInfoComponent } from "../../component/client-info/client-info.component";
import { ConflictComponent } from "../../component/conflict/conflict.component";
import { NewProposalRequirementInfoComponent } from "../../component/requirement-info/requirement-info.component";
import { NewProposalSpaceAvailabilityComponent } from "../../component/space availability/space-availability.component";
import { NewProposalComponent } from "../../new-proposal.component";

const routes: Routes = [
    {
        path: '',
        component: NewProposalComponent,
        children: [
            {
                path: '',
                redirectTo: 'client-info',
                pathMatch: 'full'
            },
            {
                path: 'client-info',
                component: NewProposalClientInfoComponent
            },
            {
                path: 'requirement-info',
                component: NewProposalRequirementInfoComponent
            },
            {
                path: 'space-availability',
                component: NewProposalSpaceAvailabilityComponent
            },
            {
                path: 'conflict',
                component: ConflictComponent
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
export class NewProposalRoutingModule {}