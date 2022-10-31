import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/service/location/location.service";

@Component({
    selector: 'location-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.scss']
})
export class LocationCenterComponent implements OnInit {

    centers = new Set();
    location: any;

    constructor(
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getCenter();
    }

    getCenter = () => {
        this.location = this.locationService.selectedLocation;
        if (this.location) {
            this.locationService.locationData.forEach((location) => {
                if (location.location === this.location) {
                    this.centers.add(location.center);
                }
            })
        }
    }

    onCenterSelected = (center: any) => {
        this.locationService.selectedCenter = center;
        this.router.navigate(['/location/','location-detail']);
    }
}