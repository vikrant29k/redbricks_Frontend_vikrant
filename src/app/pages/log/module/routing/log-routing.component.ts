import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogProposalLog } from "../../component/proposal-log/proposal-log.component";
import { LogComponent } from "../../log.component";

const routes: Routes = [
    {
        path: '',
        component: LogComponent,
        children: [
            {
                path: '',
                redirectTo: 'proposal-log',
                pathMatch: 'full'
            },
            {
                path: 'proposal-log',
                component: LogProposalLog
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class LogRoutingModule {}