import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewLayoutsComponent } from './view-layouts.component';
import { LayoutListComponent } from './components/layout-list/layout-list.component';
import {ViewLayoutRoutingModule} from './modules/routing/view-layout-routing.module';
import { ViewLayoutMaterialModule } from './modules/material/view-layout-material.module';
import { ProposalListsComponent } from './components/proposal-lists/proposal-lists.component';
import { LocationLayoutPreviewComponent } from './components/proposal-lists/layout-preview-all/location-layout-preview.component';
import { NewProposalLayoutPreviewComponent } from './components/proposal-lists/layout-preview/layout-preview.component';
import { LayoutShowLayoutComponent } from './components/show-layout/show-layout.component';
import { LocationListProposalPreview } from './components/proposal-preview/proposal-preview.component';
@NgModule({
  declarations: [
    ViewLayoutsComponent,
    LocationListProposalPreview,
    LayoutListComponent,
    ProposalListsComponent,
    NewProposalLayoutPreviewComponent,
    LocationLayoutPreviewComponent,
    LayoutShowLayoutComponent
  ],
  imports: [
    CommonModule,
    ViewLayoutRoutingModule,
    ViewLayoutMaterialModule
  ]
})
export class ViewLayoutsModule { }
