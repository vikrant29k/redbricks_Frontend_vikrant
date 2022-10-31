import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NewProposalLayoutPreviewComponent } from "../layout-preview/layout-preview.component";

@Component({
    selector: 'new-proposal-space-availability',
    templateUrl: './space-availability.component.html',
    styleUrls: ['./space-availability.component.scss']
})
export class NewProposalSpaceAvailabilityComponent {

    nonStandardRequirement: boolean = false;
    proposalId: string = 'alskdflasdflasalsdflaasd';

    proposalExtraDetailForm = new FormGroup({
        'consolidated': new FormControl(''),
        'tenure': new FormControl(''),
        'lockIn': new FormControl(''),
        'nonStandardRequirement': new FormControl(''),
        'serviced': new FormControl('')
    });

    constructor(
        private dialog: MatDialog
    ) { }

    onSubmit = () => {

    }

    openDialog = () => {
        const dialogRef = this.dialog.open(NewProposalLayoutPreviewComponent, {
            width: '800px',
            height: '566px',
            data: { proposalId: this.proposalId }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log('Dialog closed Successfully!');
        });
    }
}