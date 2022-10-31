import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PDFProgressData } from "ng2-pdf-viewer";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { environment } from "src/environments/environment";

export interface DialogData {
    proposalId: string,
    selectFrom: string
}

@Component({
    selector: 'new-proposal-layout-preview',
    templateUrl: './layout-preview.component.html',
    styleUrls: ['./layout-preview.component.scss']
})
export class NewProposalLayoutPreviewComponent implements OnInit {

    baseUrl: string = environment.baseUrl + 'proposal/';

    pdfUrl: any = "https://redbricks-server.herokuapp.com/proposal/layout/salarpuria/200/left";
    isPdfLoaded: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<NewProposalLayoutPreviewComponent>,
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

    getLayout = () => {
        this.pdfUrl = `${this.baseUrl}layout/${this.data.proposalId}/${this.data.selectFrom}`;
    }
}