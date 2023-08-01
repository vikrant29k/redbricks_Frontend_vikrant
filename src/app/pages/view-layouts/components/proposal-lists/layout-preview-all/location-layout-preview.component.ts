import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PDFProgressData } from "ng2-pdf-viewer";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { environment } from "src/environments/environment";
import { LayoutDataService } from "src/app/service/layout data/layoutData.service";
export interface DialogData {
  jsonId:any,
}

@Component({
    selector: 'location-layout-preview',
    templateUrl: './location-layout-preview.component.html',
    styleUrls: ['./location-layout-preview.component.scss']
})
export class LocationLayoutPreviewComponent implements OnInit {

    baseUrl: string = environment.baseUrl + 'layoutData/';

    pdfUrl: any = "https://redbricks-server.herokuapp.com/proposal/layout/salarpuria/200/left";
    isPdfLoaded: boolean = false;

    constructor(
      private layout:LayoutDataService,
        public dialogRef: MatDialogRef<LocationLayoutPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private proposalService: ProposalService
    ) { }

    ngOnInit(): void {
        this.getLayout();
    }

    pageInitialized = (e: any) => {
        // this.isPdfLoaded = false;
    }

    pageRendered = (e: any) => {
        // console.log('page-rendered', e);
    }

    onProgress = (e: PDFProgressData) => {
        // console.log(e);
    }

    loadComplete = (e: any) => {
        // console.log(e);
        this.isPdfLoaded = true
    }

    selectedNoOfSeat = new FormGroup({
        'noOfSeats': new FormControl(''),
        'selectFrom': new FormControl('')
    })

    // changePdf = () => {
    //     let { noOfSeats, selectFrom } = this.selectedNoOfSeat.value;
    //     this.pdfUrl = `https://redbricks-server.herokuapp.com/proposal/layout/salarpuria/${noOfSeats}/${selectFrom}`;
    // }

    getLayout = () => {
      // console.log(this.data.proposalArray)
      // this.layout.getLayout(this.data.locationId,this.data.proposalArray).subscribe(res=>{
      //   this.pdfUrl =res
      // })
      console.log(this.data.jsonId)
        this.pdfUrl = `${this.baseUrl}viewLayout/${this.data.jsonId}`;
    }
}
