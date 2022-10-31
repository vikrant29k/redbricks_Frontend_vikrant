import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { LocationService } from "src/app/service/location/location.service";
import { ProposalService } from "src/app/service/proposal/proposal.service";

@Component({
    selector: 'new-proposal-client-info',
    templateUrl: './client-info.component.html',
    styleUrls: ['./client-info.component.scss']
})
export class NewProposalClientInfoComponent implements OnInit{
    proposalId!: string;
    locations = new Set<string>();
    centers = new Set<string>();

    category: any;
    IPC: any = ['JLL', 'CBRE', 'C & W', 'KF', 'Colliers', 'Savills', 'other'];
    Non_IPC: any = ['CityInfo', 'EHRPCL', 'other'];

    // brokerCategory = {
    //     'IPC': ['JLL', 'CBRE', 'C & W', 'KF', 'Colliers', 'Savills', 'other'],
    //     'Non-IPC': ['CityInfo', 'EHRPCL', 'other']
    // }


    clientInfoForm = new FormGroup<any>({
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
        private router: Router,
        private route: ActivatedRoute,
        private locationService: LocationService,
        private proposalService: ProposalService,
        private authService: AuthenticationService
    ) { }



    onSubmit = () => {
        if (this.clientInfoForm.invalid) {
            return;
        }
        this.proposalService.addClientInfo(this.clientInfoForm.value, this.proposalId).subscribe({
            next: (result: any) => {
                if (result.Message === "Client Info added Successfully!") {
                    this.router.navigate(['/new-proposal', 'requirement-info', this.proposalId]);
                }
            },
            error: (err: any) => {
                this.authService.handleAuthError(err);
            }
        })
        
    }

    getAllLocation = () => {
        this.locationService.locationData.forEach((element) => {
            this.locations.add(element.location);
        })
    }

    getCentersInLocation = () => {
        let location: any = this.clientInfoForm.value.location || this.locationService.selectedLocation;
        if (location) {
            this.locationService.locationData.forEach((element) => {
                let temp:any = element.location;
                if (temp === location) {
                    this.centers.add(element.center);
                }
            })
        }
        console.log('location value updated::');
        // this.cd.detectChanges();
    }

    watchValueChangesInForm = () => {
        this.clientInfoForm.get('location')?.valueChanges.subscribe(() => {
            this.getCentersInLocation();
        })
        let brokerType = this.clientInfoForm.get('brokerType');
        brokerType?.valueChanges.subscribe(() => {
            let value = brokerType?.value
            
        })
    }

    ngOnInit(): void {
        this.proposalId = this.getProposalId();
        this.getAllLocation();
        this.getCentersInLocation();
        this.watchValueChangesInForm();
        this.getLocationAndCenter();
    }


    getLocationAndCenter = () => {
        let location = this.locationService.selectedLocation;
        let center = this.locationService.selectedCenter;
        this.clientInfoForm.patchValue({
            'location': location,
            'center': center
        });
    }

    getProposalId = (): string => {
        return this.route.snapshot.params['proposalId'];
    }
}