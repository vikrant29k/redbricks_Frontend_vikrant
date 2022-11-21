import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/service/location/location.service";

@Component({
    selector: 'location-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.scss']
})
export class LocationCenterComponent implements OnInit {

    // centers = new Set();
    centers!: any;
    location: any;

    constructor(
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        let locationName = this.route.snapshot.params['location'];
        this.getCenter(locationName);
    }

    getCenter = (locationName: string) => {
        // this.location = this.locationService.selectedLocation;
        // if (this.location) {
        //     this.locationService.locationData.forEach((location) => {
        //         if (location.location === this.location) {
        //             this.centers.add(location.center);
        //         }
        //     })
        // }
        this.locationService.getCentersInLocation(locationName).subscribe({
            next: (result: any) => {
                this.centers = [...result];
            }
        })
    }

    onCenterSelected = (centerId: any) => {
        this.router.navigate(['/sales','location','location-detail',centerId]);
    }
}