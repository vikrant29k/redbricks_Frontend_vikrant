import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { NewProposalLayoutPreviewComponent } from "../layout-preview/layout-preview.component";

@Component({
    selector: 'new-proposal-space-availability',
    templateUrl: './space-availability.component.html',
    styleUrls: ['./space-availability.component.scss']
})
export class NewProposalSpaceAvailabilityComponent implements OnInit {

    nonStandardRequirement: boolean = false;
    proposalId!: string;

    proposalExtraDetailForm = new FormGroup({
        'consolidated': new FormControl(''),
        'tenure': new FormControl(''),
        'lockIn': new FormControl(''),
        'nonStandardRequirement': new FormControl(''),
        'serviced': new FormControl('')
    });

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private proposalService: ProposalService
    ) { }

    onSubmit = () => {

    }

    ngOnInit(): void {
        this.proposalId = this.route.snapshot.params['proposalId'];
    }

    openDialog = () => {
        const dialogRef = this.dialog.open(NewProposalLayoutPreviewComponent, {
            width: '800px',
            height: '566px',
            data: { proposalId: this.proposalId, selectFrom: 'left' }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log('Dialog closed Successfully!');
        });
    }

    generateProposal = () => {
        this.proposalService.generateProposal(this.proposalId, 'left').subscribe((result: any) => {
                this.router.navigate(['/'])
            }
        );
    }
}