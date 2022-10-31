import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { OldProposalComponent } from "./old-proposal.component";
import { ClosureComponent } from "./component/conflict/closure.component";
import { OldProposalRoutingModule } from "./module/routing/old-proposal-routing.module";
@NgModule({
    declarations: [
        OldProposalComponent,
        ClosureComponent,
        
    ],
    imports: [
        CommonModule,
       ReactiveFormsModule,
     OldProposalRoutingModule
        
    ]
})
export class OldProposalModule {}