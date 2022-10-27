import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'new-proposal-client-info',
    templateUrl: './client-info.component.html',
    styleUrls: ['./client-info.component.scss']
})
export class NewProposalClientInfoComponent {
    proposalId: any;

    clientInfoForm = new FormGroup({
        'salesTeam': new FormControl('', Validators.required),
        'salesHead': new FormControl('', Validators.required),
        'location': new FormControl('', Validators.required),
        'center': new FormControl('', Validators.required),
        'spocName': new FormControl('', Validators.required),
        'clientName': new FormControl('', Validators.required),
        'brokerType': new FormControl('', Validators.required),
        'brokerCategory': new FormControl('', Validators.required),
        'brokerCategoryOther': new FormControl('')
    });

    constructor(
        private router: Router
    ) { }

    onSubmit = () => {
        console.log(this.clientInfoForm.value);
        this.router.navigate(['/new-proposal', 'requirement-info']);
    }
}