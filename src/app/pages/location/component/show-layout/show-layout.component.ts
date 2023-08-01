// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from "@angular/router";
// import { LocationService } from 'src/app/service/location/location.service';
import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PDFProgressData } from "ng2-pdf-viewer";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from "src/app/service/location/location.service";
@Component({
  selector: 'app-show-layout',
  templateUrl: './show-layout.component.html',
  styleUrls: ['./show-layout.component.scss']
})
export class ShowLayoutComponent implements OnInit {
  // baseUrl: any = environment.baseUrl + 'proposal/';
  // proposalId: any = '';

  // pdfUrl: any = this.baseUrl + 'viewLayoutSales/' +this.proposalId ;
  // isPdfLoaded: boolean = false;

  // constructor(
  //     private router: Router,
  //     private route: ActivatedRoute,
  // ) {}

  // ngOnInit(): void {
  //     this.proposalId = this.route.snapshot.params['Id'];
  //     this.pdfUrl = this.baseUrl + this.proposalId ;
  // }

  // pageInitialized = (e: any) => {
  //     // this.isPdfLoaded = false;
  // }

  // pageRendered = (e: any) => {
  //     // console.log('page-rendered', e);
  // }

  // onProgress = (e: PDFProgressData) => {
  //     // console.log(e);
  // }

  // loadComplete = (e: any) => {
  //     // console.log(e);
  //     this.isPdfLoaded = true
  // }
  layoutData:any=[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService:LocationService
  ) { }

  ngOnInit(): void {
    // console.log("hello layout")
    let centerId = this.route.snapshot.params['Id'];
    this.getCenterData(centerId);
  }

  getCenterData = (centerId: string) => {
    this.locationService.getLocationById(centerId).subscribe({
        next: (result: any) => {
            this.layoutData = {...result};
        }
    })
}
}

