import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LocationService } from "src/app/service/location.service";

@Component({
    selector: 'new-proposal-client-info',
    templateUrl: './client-info.component.html',
    styleUrls: ['./client-info.component.scss']
})
export class NewProposalClientInfoComponent implements OnInit{
    proposalId: any;
    locations = new Set<string>();
    centers = new Set<string>();

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
        private locationService: LocationService,
        private cd: ChangeDetectorRef
    ) { }

    onSubmit = () => {
        console.log(this.clientInfoForm.value);
        this.router.navigate(['/new-proposal', 'requirement-info']);
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
    }

    ngOnInit(): void {
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
}