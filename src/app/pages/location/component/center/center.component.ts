import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/service/location/location.service";

@Component({
    selector: 'location-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.scss']
})
export class LocationCenterComponent implements OnInit {
@ViewChild('floorValue')floorValue:any|ElementRef
    // centers = new Set();
    centers!: any;
    location: any;
    floors:any;

    constructor(
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        let locationName = this.route.snapshot.params['location'];
        this.getCenter(locationName);

    }

    // getFloor(floorName: string) {
    //   console.log("Center ID in floors", floorName);
    //   this.locationService.getFloorsInLocation(floorName).subscribe({
    //     next: (result: any) => {
    //         this.floors = [...result];

    //         this.onCenterSelected(floorName);
    //     }
    // })

    // }
    getCenter = (locationName: string) => {

        this.locationService.getCentersInLocation(locationName).subscribe({
            next: (result: any) => {
                this.centers = [...result];
                // console.log(this.centers)

            }

        })

    }
    showGallery(centerId:any){
      this.router.navigate(['/sales','location','show-gallery', centerId]);
    }
    showLayout(centerId:any){
      this.router.navigate(['/sales','location','show-layout',centerId]);
    }
    onCenterSelected = (centerName: any) => {
      // console.log(centerName, "Selected center")
        this.router.navigate(['/sales','location','floor',centerName]);
    }
}
