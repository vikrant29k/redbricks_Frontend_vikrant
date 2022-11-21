import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewProposalClientInfoComponent } from "../../component/client-info/client-info.component";
import { ConflictComponent } from "../../component/conflict/conflict.component";
import { NewProposalProposalPreviewComponent } from "../../component/proposal-preview/proposal-preview.component";
import { NewProposalRequirementInfoComponent } from "../../component/requirement-info/requirement-info.component";
import { NewProposalSpaceAvailabilityComponent } from "../../component/space-availability/space-availability.component";
import { NewProposalComponent } from "../../new-proposal.component";
import { NewProposalAdminChildRouteGuard } from "../service/new-proposal-admin-child-route-guard/new-proposal-admin-route-guard.guard";

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
                path: 'client-info/:proposalId',
                canActivate: [NewProposalAdminChildRouteGuard],
                component: NewProposalClientInfoComponent
            },
            {
                path: 'requirement-info/:proposalId',
                canActivate: [NewProposalAdminChildRouteGuard],
                component: NewProposalRequirementInfoComponent
            },
            {
                path: 'space-availability/:proposalId',
                canActivate: [NewProposalAdminChildRouteGuard],
                component: NewProposalSpaceAvailabilityComponent
            },
            {
                path: 'conflict/:proposalId',
                canActivate: [NewProposalAdminChildRouteGuard],
                component: ConflictComponent
            },
            {
                path: 'proposal-preview/:proposalId',
                component: NewProposalProposalPreviewComponent
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