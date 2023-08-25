import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
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
  @Input() indicators = true;
  @ViewChild('zoomableImage', { static: true }) zoomableImage: any| ElementRef;
  zoomed = false;
  zoomX = 0;
  zoomY = 0;

  toggleZoom(event: MouseEvent) {
    const imgElement = this.zoomableImage.nativeElement;
    this.zoomed = !this.zoomed;

    if (this.zoomed) {
      const rect = imgElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.zoomX = -(x / rect.width * 100);
      this.zoomY = -(y / rect.height * 100);
    } else {
      this.zoomX = 0;
      this.zoomY = 0;
    }
  }
  images: string[] = [
    'https://coworkingers.com/wp-content/uploads/2020/11/Redbrick-Offices-004.jpg',
    'https://coworkingers.com/wp-content/uploads/2020/07/Redbrick-Offices-001-min.jpg',
    'https://coworker.imgix.net/photos/india/mumbai/redbrick-andheri-east/1-1557813134.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
    'https://coworker.imgix.net/photos/india/mumbai/redbrick-andheri-east/main.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle'
  ];

  videos:string[]=[
    'https://youtu.be/hNjFmOUK-oE'
  ]
  currentIndex = 0;

  selectImage(index:number):void{
    this.currentIndex=index;
  }
  changeImageAuto() {
    setTimeout(() => {
      this.currentIndex++;
      if (this.currentIndex >= 4) {
        this.currentIndex = 0;
      }
      this.changeImageAuto();
    }, 3000); // Delay of 1000 milliseconds (1 second)
  }
  // previousImage(): void {
  //   if (this.currentIndex > 0) {
  //     this.currentIndex--;
  //   }
  // }

  // nextImage(): void {
  //   if (this.currentIndex < this.images.length - 1) {
  //     this.currentIndex++;
  //   }
  // }
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
this.changeImageAuto();
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
                    this.locationService.selectedAddress = this.centerData.address;
                    this.locationService.selectedFloor = this.centerData.floor;
                    this.locationService.locationId = this.centerData._id;
                    // console.log(this.centerData);
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
