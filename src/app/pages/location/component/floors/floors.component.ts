import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "src/app/service/location/location.service";
@Component({
  selector: 'app-floors',
  templateUrl: './floors.component.html',
  styleUrls: ['./floors.component.scss']
})
export class FloorsComponent implements OnInit {
  // centers = new Set();
  floors!: any;
  location: any;

  constructor(
      private locationService: LocationService,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      let floorName = this.route.snapshot.params['center'];
      this.getFloor(floorName);
  }

  getFloor = (floorName: string) => {
    console.log("Center Name in floors", floorName)
      this.locationService.getFloorsInLocation(floorName).subscribe({
          next: (result: any) => {
              this.floors = [...result];
          }
      })
  }
  showGallery(centerId:any){
    this.router.navigate(['/sales','location','show-gallery', centerId]);
  }
  showLayout(centerId:any){
    this.router.navigate(['/sales','location','show-layout',centerId]);
  }
  onFloorSelected = (centerId: any) => {
      this.router.navigate(['/sales','location','location-detail',centerId]);
  }
}
