import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { PDFProgressData } from "ng2-pdf-viewer";
import { ActivatedRoute, Router } from '@angular/router';
import { FileExistenceService } from "src/app/service/fileExist/fileExistenceService.service";

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
        private fileExistenceService: FileExistenceService
    ) {}
    fileNotFoundError:any
    ngOnInit(): void {
      this.proposalId = this.route.snapshot.params['proposalId'];
      this.pdfUrl = this.baseUrl + this.proposalId + '.pdf';

      // Check if the file exists
      this.fileExistenceService.checkFileExists(this.pdfUrl).subscribe({

        next: (result: any) => {
            // console.log(this.pdfUrl,result);
            // The file exists, you can render the PDF viewer here
          },
         error: (error:any) => {
            console.error('File not found:', error);
            // Handle the case where the file does not exist, e.g., show an error message
            // You can set a flag to hide the spinner and show an error message in your template
            this.isPdfLoaded = true; // Set this to true to hide the spinner
            this.fileNotFoundError = true; // Add a flag to display an error message
          }
        }
        );
    }

    pageInitialized = (e: any) => {
      // console.log(e)
        // this.isPdfLoaded = false;
    }

    pageRendered = (e: any) => {
        // console.log('page-rendered', e);
    }

    onProgress = (e: PDFProgressData) => {
        // console.log(e);
    }

    loadComplete = (e: any) => {
        // console.log(e);/
        this.isPdfLoaded = true
    }
}
