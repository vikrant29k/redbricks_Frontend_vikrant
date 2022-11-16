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
    totalWorkStationBalance: any = 373;
    totalWorkstationBooked: any = 0;
    totalAvailableWorkstation: any = 373;
    totalSelectedWorkstation: any = 0;

    requirementInfoForm = new FormGroup({
        'workstationSize': new FormControl(''),
        'workstationNumber': new FormControl(''),
        'cabinSize': new FormControl(''),
        'cabinNumber': new FormControl(''),
        'meetingRoomSize': new FormControl(''),
        'meetingRoomNumber': new FormControl(''),
        'visitorMeetingRoomSize': new FormControl(''),
        'visitorMeetingRoomNumber': new FormControl(''),
        'collabArea': new FormControl('no'),
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
        this.totalWorkStationBalance = this.proposalService.TotalNoOfSets;
        this.totalAvailableWorkstation = this.proposalService.AvailableNoOfSeats;
        this.proposalId = this.getProposaId();
        this.watchFormValue();
    }

    onSubmit = () => {
        this.proposalService.addRequirement(this.requirementInfoForm.value, this.proposalId).subscribe({
            next: (result: any) => {
                if (result.Message === "Requirement added Successfully!") {
                    this.proposalService.consolidatedSeats = result.consolidatedSeats;
                    this.proposalService.seatAvailability = result.seatsAvailability;
                    this.proposalService.conflict = result.conflict;
                    this.router.navigate(['/sales','new-proposal', 'conflict',this.proposalId]);
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

    watchFormValue = () => {
        this.requirementInfoForm.valueChanges.subscribe(() => {
            let value = this.requirementInfoForm.value;
            this.totalSelectedWorkstation = Number(value.workstationNumber) + Number(value.cabinNumber) + Number(value.meetingRoomNumber) + Number(value.visitorMeetingRoomNumber);
        })
    }

    selectOnlyOneCheckBox = (control: string, value: string) => {
        this.requirementInfoForm.get(control)?.setValue(value);
        console.log(this.requirementInfoForm.get(control)?.value);
    }
}