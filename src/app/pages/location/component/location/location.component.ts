import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocationService } from "src/app/service/location/location.service";

@Component({
    selector: 'location-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationLocationComponent implements OnInit {

    locations = new Set();
    cities: string[] = ['Pune', 'Mumbai', 'Kolkata', 'Delhi', 'Kota', 'Banglore', 'Chandigad'];
    iconColor: string[] = ['red', 'blue', 'yellow', 'pink', 'green', 'black'];

    constructor(
        private locationService: LocationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getLocation();
    }

    getLocation = () => {
        this.locationService.locationData.forEach((location) => {
            this.locations.add(location.location);
        })
    }

    onLocationSelected = (location: any) => {
        this.locationService.selectedLocation = location;
        this.router.navigate(['/location', 'center'])
    }
}