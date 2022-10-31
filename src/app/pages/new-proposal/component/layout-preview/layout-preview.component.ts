import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PDFProgressData } from "ng2-pdf-viewer";

export interface DialogData {
    noOfSeats: string,
    selectFrom: string
}

@Component({
    selector: 'new-proposal-layout-preview',
    templateUrl: './layout-preview.component.html',
    styleUrls: ['./layout-preview.component.scss']
})
export class NewProposalLayoutPreviewComponent implements OnInit {

    pdfUrl: any = "https://redbricks-server.herokuapp.com/proposal/layout/salarpuria/200/left";
    isPdfLoaded: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<NewProposalLayoutPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    ngOnInit(): void {
        // this.getPdf();
    }

    pageInitialized = (e: any) => {
        console.log('page-initialized', e);
    }

    pageRendered = (e: any) => {
        console.log('page-rendered', e);
    }

    onProgress = (e: PDFProgressData) => {
        console.log(e);
    }

    loadComplete = (e: any) => {
        console.log(e);
        this.isPdfLoaded = true
    }

    selectedNoOfSeat = new FormGroup({
        'noOfSeats': new FormControl(''),
        'selectFrom': new FormControl('')
    })

    changePdf = () => {
        let { noOfSeats, selectFrom } = this.selectedNoOfSeat.value;
        this.pdfUrl = `https://redbricks-server.herokuapp.com/proposal/layout/salarpuria/${noOfSeats}/${selectFrom}`;
    }
}