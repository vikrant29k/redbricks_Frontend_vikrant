import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from 'src/app/service/location/location.service';
@Component({
  selector: 'app-show-gallery',
  templateUrl: './show-gallery.component.html',
  styleUrls: ['./show-gallery.component.scss']
})
export class ShowGalleryComponent implements OnInit {
  images: string[] = []
  videos:string[]=[]
  currentIndex = 0;
  @Input() indicators = true;
  constructor( private router: Router,
    private route: ActivatedRoute,
    private locationService:LocationService) { }
    selectImage(index:number):void{
      this.currentIndex=index;
    }
    changeImageAuto() {
      setTimeout(() => {
        this.currentIndex++;
        if (this.currentIndex >= this.images.length) {
          this.currentIndex = 0;
        }
        this.changeImageAuto();
      }, 3000); // Delay of 1000 milliseconds (1 second)
    }
imageData:any=[]

  ngOnInit(): void {
    let centerId = this.route.snapshot.params['Id'];
    this.getCenterData(centerId);
    this.changeImageAuto();
  }

  getCenterData = (centerId: string) => {
    this.locationService.getLocationById(centerId).subscribe({
        next: (result: any) => {
            this.imageData = {...result};
            this.images = this.imageData.imageLinks
            // this.videos = this.imageData.videoLinks
        }
    })
}

}
