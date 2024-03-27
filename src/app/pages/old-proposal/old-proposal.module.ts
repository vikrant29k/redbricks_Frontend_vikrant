import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { OldProposalComponent } from "./old-proposal.component";
import { ClosureComponent } from "./component/conflict/closure.component";
import { OldProposalRoutingModule } from "./module/routing/old-proposal-routing.module";
import { OldProposalTableComponent } from "./component/old-proposal-table/old-proposal-table.component";
import { OldProposalMaterialModule } from "./module/material/old-proposal-material.module";
import { OldClientListComponent } from './component/old-client-list/old-client-list.component';
import { AddOldClientComponent } from './component/add-old-client/add-old-client.component';
import { PreviewLayoutAllclientsComponent } from './component/old-client-list/preview-layout-allclients/preview-layout-allclients.component';
@NgModule({
    declarations: [
        OldProposalComponent,
        ClosureComponent,
        OldProposalTableComponent,
        OldClientListComponent,
        AddOldClientComponent,
        PreviewLayoutAllclientsComponent
        
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        OldProposalRoutingModule,
        OldProposalMaterialModule
        
    ]
})
export class OldProposalModule {}