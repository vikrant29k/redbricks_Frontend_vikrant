import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NewProposalClientInfoComponent } from "./component/client-info/client-info.component";
import { NewProposalRequirementInfoComponent } from "./component/requirement-info/requirement-info.component";
import { NewProposalSpaceAvailabilityComponent } from "./component/space availability/space-availability.component";
import { NewProposalMaterialModule } from "./module/material/new-proposal-material.module";
import { NewProposalRoutingModule } from "./module/routing/new-proposal-routing.module";
import { NewProposalComponent } from "./new-proposal.component";

import { ConflictComponent } from "./component/conflict/conflict.component";

import { PdfViewerModule } from "ng2-pdf-viewer";
import { NewProposalLayoutPreviewComponent } from "./component/layout-preview/layout-preview.component";


@NgModule({
    declarations: [
        NewProposalComponent,
        NewProposalClientInfoComponent,

        ConflictComponent,
        NewProposalRequirementInfoComponent

        NewProposalRequirementInfoComponent,
        NewProposalSpaceAvailabilityComponent,
        NewProposalLayoutPreviewComponent

    ],
    imports: [
        CommonModule,
        NewProposalRoutingModule,
        NewProposalMaterialModule,
        ReactiveFormsModule,
        PdfViewerModule
    ]
})
export class NewProposalModule {}