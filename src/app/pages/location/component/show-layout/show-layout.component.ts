import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from 'src/app/service/location/location.service';
@Component({
  selector: 'app-show-layout',
  templateUrl: './show-layout.component.html',
  styleUrls: ['./show-layout.component.scss']
})
export class ShowLayoutComponent implements OnInit {
layoutData:any=[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService:LocationService
  ) { }

  ngOnInit(): void {
    console.log("hello layout")
    let centerId = this.route.snapshot.params['Id'];
    this.getCenterData(centerId);
  }

  getCenterData = (centerId: string) => {
    this.locationService.getLocationById(centerId).subscribe({
        next: (result: any) => {
            this.layoutData = {...result};
        }
    })
}
}
