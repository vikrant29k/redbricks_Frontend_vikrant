import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
    selectFrom: "left" | "right" = 'left';
    seatAvailability: boolean = true;
    consolidatedSeats: boolean = false;

    proposalExtraDetailForm = new FormGroup({
        'consolidated': new FormControl(''),
        'Tenure': new FormControl('',Validators.required),
        'LockIn': new FormControl('',Validators.required),
        'NonStandardRequirement': new FormControl(''),
        'Serviced': new FormControl('',Validators.required)
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
        this.consolidatedSeats = this.proposalService.consolidatedSeats;
        this.seatAvailability = this.proposalService.seatAvailability;
        this.proposalId = this.route.snapshot.params['proposalId'];
    }

    openDialog = () => {
        const dialogRef = this.dialog.open(NewProposalLayoutPreviewComponent, {
            width: '800px',
            height: '566px',
            data: { proposalId: this.proposalId, selectFrom: this.selectFrom }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log('Dialog closed Successfully!');
        });
    }

    generateProposal = () => {
        let serviced = this.isServiced ? 'yes' : 'no';
        let acceptConsolidatedSeats = this.isAcceptConsolidatedSeats ? 'yes' : 'no';
        this.proposalExtraDetailForm.patchValue({ consolidated: acceptConsolidatedSeats, Serviced: serviced });
        if (this.proposalExtraDetailForm.invalid) {
            return;
        }
        this.proposalService.generateProposal(this.proposalId, this.selectFrom, this.proposalExtraDetailForm.value).subscribe({
            next: (result: any) => {
                if (result.Message === 'Proposal Generated Successfully') {
                    this.router.navigate(['/sales','sales-dashboard']);
                }
            },
            error: (err: any) => {

            }
        });
        // this.router.navigate(['/']);
    }
}