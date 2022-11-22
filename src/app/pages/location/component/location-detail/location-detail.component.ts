import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { LocationService } from "src/app/service/location/location.service";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import Swal from "sweetalert2";

@Component({
    selector: 'location-location-detail',
    templateUrl: './location-detail.component.html',
    styleUrls: ['./location-detail.component.scss']
})
export class LocationLocationDetailComponent implements OnInit {

    // location: any;
    // center: any;
    centerData: any = {};

    constructor(
        private locationService: LocationService,
        private proposalService: ProposalService,
        private authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    getCenterData = (centerId: string) => {
        this.locationService.getLocationById(centerId).subscribe({
            next: (result: any) => {
                this.centerData = {...result};
            }
        })
    }

    ngOnInit(): void {
        let centerId = this.route.snapshot.params['Id'];
        this.getCenterData(centerId);
    }

    addProposal = (centerId: string) => {
        Swal.fire({
            title: 'Initialized Proposal',
            text: 'Once you initialized proposal it cannot be undone',
            icon: 'question',
            showConfirmButton: true,
            confirmButtonText: 'Initialized',
            confirmButtonColor: '#C3343A',
            showCancelButton: true,
            cancelButtonColor: '#7D7E80'
        }).then((confirmation) => {
            if (confirmation.isConfirmed) {
                this.initiateProposal(centerId);
            }
        })
    }

    initiateProposal = (centerId: string) => {
        this.proposalService.initializeProposal(centerId).subscribe({
            next: (result: any) => {
                if (result.Message === "Proposal Initiated Successfully") {
                    this.locationService.selectedLocation = this.centerData.location;
                    this.locationService.selectedCenter = this.centerData.center;
                    console.log(this.centerData);
                    // this.router.navigate(['/new-proposal/add', this.location, result.Id]);
                    this.router.navigate(['/sales','new-proposal', 'client-info',result.Id]);
                }
            },
            error: (err: any) => {
                this.authService.handleAuthError(err);
            }
        });
    }
}