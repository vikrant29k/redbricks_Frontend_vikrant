import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
    selector: 'new-proposal-requirement-info',
    templateUrl: './requirement-info.component.html',
    styleUrls: ['./requirement-info.component.scss']
})
export class NewProposalRequirementInfoComponent {
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
        private router: Router
    ) { }
    onSubmit = () => {
        console.log(this.requirementInfoForm.value);
        this.router.navigate(['/new-proposal', 'conflict']);
    }

    selectOnlyOneCheckBox = (control: string, value: string) => {
        this.requirementInfoForm.get(control)?.setValue(value);
        console.log(this.requirementInfoForm.get(control)?.value);
    }
}