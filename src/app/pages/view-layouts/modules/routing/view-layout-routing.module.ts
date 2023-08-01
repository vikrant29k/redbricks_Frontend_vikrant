import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewLayoutsComponent } from "../../view-layouts.component";
import { LayoutListComponent } from "../../components/layout-list/layout-list.component";
import { LayoutShowLayoutComponent } from "../../components/show-layout/show-layout.component";
import { ProposalListsComponent } from "../../components/proposal-lists/proposal-lists.component";
import { LocationListProposalPreview } from "../../components/proposal-preview/proposal-preview.component";
const routes: Routes = [
    {
        path: '',
        component: ViewLayoutsComponent,
        children: [
            {
                path: '',
                redirectTo: 'layout-list',
                pathMatch: 'full'
            },
            {
              path: 'layout-list',
              component: LayoutListComponent
          },
          {
            path:'show-layout/:Id',
            component:LayoutShowLayoutComponent
          },
          {
            path:'proposal-list/:Id/:jsonId',
            component:ProposalListsComponent
          },
          {
            path: 'proposal-preview/:proposalId',
            component: LocationListProposalPreview,
          },

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
export class ViewLayoutRoutingModule {}
