import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NewProposalClientInfoComponent } from "./component/client-info/client-info.component";
import { NewProposalRequirementInfoComponent } from "./component/requirement-info/requirement-info.component";
import { NewProposalSpaceAvailabilityComponent } from "./component/space-availability/space-availability.component";
import { NewProposalMaterialModule } from "./module/material/new-proposal-material.module";
import { NewProposalRoutingModule } from "./module/routing/new-proposal-routing.module";
import { NewProposalComponent } from "./new-proposal.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { NewProposalLayoutPreviewComponent } from "./component/layout-preview/layout-preview.component";
import { NewProposalProposalPreviewComponent } from "./component/proposal-preview/proposal-preview.component";
import { NewProposalAdminChildRouteGuard } from "./module/service/new-proposal-admin-child-route-guard/new-proposal-admin-route-guard.guard";
import { LayoutPreviewDemoComponent } from './component/layout-preview-demo/layout-preview-demo.component';
import { ViewLayoutPreviewComponent } from './component/layout-preview-demo/view-layout-preview/view-layout-preview.component';


@NgModule({
    declarations: [
        NewProposalComponent,
        NewProposalClientInfoComponent,
        NewProposalRequirementInfoComponent,
        NewProposalSpaceAvailabilityComponent,
        NewProposalLayoutPreviewComponent,
        NewProposalProposalPreviewComponent,
        LayoutPreviewDemoComponent,
        ViewLayoutPreviewComponent

    ],
    imports: [
        CommonModule,
        NewProposalRoutingModule,
        NewProposalMaterialModule,
        ReactiveFormsModule,
        PdfViewerModule
    ],
    providers: [NewProposalAdminChildRouteGuard]
})
export class NewProposalModule {}
