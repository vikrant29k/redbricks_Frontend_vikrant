import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { BrokerData, BrokerService } from "src/app/service/broker/broker.service";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";

@Component({
    selector: 'broker-add-broker',
    templateUrl: './add-broker.component.html',
    styleUrls: ['./add-broker.component.scss']
})
export class BrokerAddBrokerComponent implements OnInit {

    editMode: boolean = false;
    brokerId!: string;

    brokerForm = new FormGroup({
        'brokerType': new FormControl(''),
        'brokerCategory': new FormControl(''),
        'SPOCName': new FormControl(''),
        'SPOCEmail': new FormControl(''),
        'SPOCNumber': new FormControl('')
    });

    constructor(
        private brokerService: BrokerService,
        private authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }
    
    ngOnInit(): void {
        this.brokerId = this.route.snapshot.params["brokerId"];
        if (this.brokerId) this.getBrokerDataToEdit(this.brokerId);
    }

    onSubmit = () => {
        if (!this.editMode) {
            this.brokerService.addBroker(this.brokerForm.value as BrokerData).subscribe({
                next: (result: unknown) => {
                    this.router.navigate(['/admin', 'broker', 'broker-list']);
                },
                error: (err: unknown) => {
                    this.authService.handleAuthError(err);
                }
            })
        }
        else {
            this.brokerService.updateBroker(this.brokerId, this.brokerForm.value as BrokerData).subscribe({
                next: (result: unknown) => {
                    this.router.navigate(['/admin', 'broker', 'broker-list']);
                },
                error: (err: unknown) => {
                    this.authService.handleAuthError(err);
                }
            })
        }
    }

    getBrokerDataToEdit = (id: string) => {
        this.brokerService.getBrokerById(id).subscribe({
            next: (result: unknown) => {
                this.brokerForm.patchValue(result as BrokerData);
                this.editMode = true;
            },
            error: (err: unknown) => {
                this.authService.handleAuthError(err);
            }
        })
    }

    cancelUpdate = () => {
        this.brokerForm.reset();
        if (this.editMode) this.router.navigate(['/admin', 'broker', 'broker-list']);
    }

    
}