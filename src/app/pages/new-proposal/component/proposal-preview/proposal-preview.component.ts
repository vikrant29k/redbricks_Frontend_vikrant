import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { PDFProgressData } from "ng2-pdf-viewer";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'new-proposal-proposal-preview',
    templateUrl: './proposal-preview.component.html',
    styleUrls: ['./proposal-preview.component.scss']
})
export class NewProposalProposalPreviewComponent implements OnInit {

    baseUrl: any = environment.baseUrl + 'generated-proposal/';
    proposalId: any = '';

    pdfUrl: any = this.baseUrl + this.proposalId + '.pdf';
    isPdfLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.proposalId = this.route.snapshot.params['proposalId'];
        this.pdfUrl = this.baseUrl + this.proposalId + '.pdf';
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
}