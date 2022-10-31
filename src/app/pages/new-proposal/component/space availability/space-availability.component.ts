import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'new-proposal-space-availability',
    templateUrl: './space-availability.component.html',
    styleUrls: ['./space-availability.component.scss']
})
export class NewProposalSpaceAvailabilityComponent {

    nonStandardRequirement: boolean = false;

    proposalExtraDetailForm = new FormGroup({
        'consolidated': new FormControl(''),
        'tenure': new FormControl(''),
        'lockIn': new FormControl(''),
        'nonStandardRequirement': new FormControl(''),
        'serviced': new FormControl('')
    });

    onSubmit = () => {
        
    }
}