import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OldProposalRoutingModule } from "../dashboard/module/routing/old-proposal-routing.module";
import { OldProposalComponent } from "./old-proposal.component";

@NgModule({
    declarations: [
        OldProposalComponent
    ],
    imports: [
        CommonModule,
       OldProposalRoutingModule
        
    ]
})
export class OldProposalModule {}