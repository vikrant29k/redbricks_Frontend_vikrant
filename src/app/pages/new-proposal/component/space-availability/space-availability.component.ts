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
    isServiced: boolean = false;
    isAcceptConsolidatedSeats: boolean = true;

    proposalExtraDetailForm = new FormGroup({
        'consolidated': new FormControl(''),
        'Tenure': new FormControl(''),
        'LockIn': new FormControl(''),
        'NonStandardRequirement': new FormControl(''),
        'Serviced': new FormControl('')
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
        let serviced = this.isServiced ? 'yes' : 'no';
        let acceptConsolidatedSeats = this.isAcceptConsolidatedSeats ? 'yes' : 'no';
        this.proposalExtraDetailForm.patchValue({ consolidated: acceptConsolidatedSeats, Serviced: serviced });
        this.proposalService.generateProposal(this.proposalId, 'left', this.proposalExtraDetailForm.value).subscribe({
            next: (result: any) => {
                if (result.Message === 'Proposal Generated Successfully') {
                    this.router.navigate(['/new-proposal','proposal-preview',this.proposalId]);
                }
            },
            error: (err: any) => {

            }
        });
        // this.router.navigate(['/']);
    }
}