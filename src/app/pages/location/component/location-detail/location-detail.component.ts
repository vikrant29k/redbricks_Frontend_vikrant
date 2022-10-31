import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/service/location.service";
import Swal from "sweetalert2";

@Component({
    selector: 'location-location-detail',
    templateUrl: './location-detail.component.html',
    styleUrls: ['./location-detail.component.scss']
})
export class LocationLocationDetailComponent implements OnInit {

    location: any;
    center: any;

    constructor(
        private locationService: LocationService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    getCenterData = () => {
        this.location = this.locationService.selectedLocation;
        this.center = this.locationService.selectedCenter;
    }

    ngOnInit(): void {
        this.getCenterData();
    }

    addProposal = () => {
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
                this.initiateProposal();
            }
        })
    }

    initiateProposal = () => {
        this.router.navigate(['/new-proposal','client-info'])
    }
}