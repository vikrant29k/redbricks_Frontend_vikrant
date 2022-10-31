import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import Swal from "sweetalert2";
@Component({
    selector: 'new-proposal-requirement-info',
    templateUrl: './requirement-info.component.html',
    styleUrls: ['./requirement-info.component.scss']
})
export class NewProposalRequirementInfoComponent implements OnInit {
    proposalId: string = 'lasdfoawefalsdfalskdf';

    requirementInfoForm = new FormGroup({
        'workstationSize': new FormControl(''),
        'workstationNumber': new FormControl(''),
        'cabinSize': new FormControl(''),
        'cabinNumber': new FormControl(''),
        'meetingRoomSize': new FormControl(''),
        'meetingRoomNumber': new FormControl(''),
        'visitorMeetingRoomSize': new FormControl(''),
        'visitorMeetingRoomNumber': new FormControl(''),
        'collabArea': new FormControl(''),
        'dryPantry': new FormControl(''),
        'storeRoom': new FormControl(''),
        'storeRoomNumber': new FormControl(''),
        'cafeteria': new FormControl(''),
        'cafeteriaNumber': new FormControl(''),
        'reception': new FormControl(''),
        'mailRoom': new FormControl(''),
        'bmsRoom': new FormControl(''),
        'compactor': new FormControl('')
    })

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private proposalService: ProposalService,
        private authService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.proposalId = this.getProposaId();
    }

    onSubmit = () => {
        this.proposalService.addRequirement(this.requirementInfoForm.value, this.proposalId).subscribe({
            next: (result: any) => {
                if (result.Message === "Requirement added Successfully!") {
                    this.router.navigate(['/new-proposal', 'conflict',this.proposalId]);
                }
            },
            error: (err: any) => {
                this.authService.handleAuthError(err);
            }
        })
    }

    getProposaId = () => {
        return this.route.snapshot.params['proposalId'];
    }

    selectOnlyOneCheckBox = (control: string, value: string) => {
        this.requirementInfoForm.get(control)?.setValue(value);
        console.log(this.requirementInfoForm.get(control)?.value);
    }
}