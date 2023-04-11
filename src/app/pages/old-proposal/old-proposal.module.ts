import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { OldProposalComponent } from "./old-proposal.component";
import { ClosureComponent } from "./component/conflict/closure.component";
import { OldProposalRoutingModule } from "./module/routing/old-proposal-routing.module";
import { OldProposalTableComponent } from "./component/old-proposal-table/old-proposal-table.component";
import { OldProposalMaterialModule } from "./module/material/old-proposal-material.module";
import { DeselectUpdateComponent } from './component/deselect-update/deselect-update.component';
@NgModule({
    declarations: [
        OldProposalComponent,
        ClosureComponent,
        OldProposalTableComponent,
        DeselectUpdateComponent
        
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        OldProposalRoutingModule,
        OldProposalMaterialModule
        
    ]
})
export class OldProposalModule {}