import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { LocationService } from "src/app/service/location/location.service";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import Swal from "sweetalert2";

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
        Swal.fire({
            title: 'Initialized Proposal And Add Client Info',
            text: 'Once you initialized proposal and added client Info it cannot be undone',
            icon: 'question',
            showConfirmButton: true,
            confirmButtonText: 'Proceed',
            confirmButtonColor: '#C3343A',
            showCancelButton: true,
            cancelButtonColor: '#7D7E80'
        }).then((confirmation) => {
            if (confirmation.isConfirmed) {
                this.addClientInfo();
            }
        })
        
    }

    addClientInfo = () => {
        this.proposalService.addClientInfo(this.clientInfoForm.value, this.proposalId).subscribe({
            next: (result: any) => {
                if (result.Message === "Client Info added Successfully!") {
                    this.proposalService.AvailableNoOfSeats = result.AvailableNoOfSeatsInLayout;
                    this.proposalService.TotalNoOfSets = result.TotalNoOfSeatsInLayout;
                    this.router.navigate(['/sales','new-proposal', 'requirement-info', this.proposalId]);
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
        console.log(location,center)
        this.clientInfoForm.patchValue({
            'location': location,
            'center': center
        });
        console.log(this.clientInfoForm.value)
    }

    getProposalId = (): string => {
        return this.route.snapshot.params['proposalId'];
    }
}