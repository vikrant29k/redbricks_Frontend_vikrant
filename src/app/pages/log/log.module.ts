import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LogProposalLog } from "./component/proposal-log/proposal-log.component";
import { LogComponent } from "./log.component";
import { LogMaterialMoudle } from "./module/material/log-material.module";
import { LogRoutingModule } from "./module/routing/log-routing.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [
        LogComponent,
        LogProposalLog,
       
    ],
    imports: [
        CommonModule,
        LogRoutingModule,
        LogMaterialMoudle,
        MatMenuModule,
        MatIconModule,
        
    ]
})
export class LogModule {}