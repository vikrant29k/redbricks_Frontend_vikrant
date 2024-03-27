import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { LocationService } from 'src/app/service/location/location.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-preview-layout-allclients',
  templateUrl: './preview-layout-allclients.component.html',
  styleUrls: ['./preview-layout-allclients.component.scss']
})
export class PreviewLayoutAllclientsComponent implements OnInit, AfterViewInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
  customWidth = 1080;
  customHeight = 734;
  getAllPoints: any[] = [];

  imageName!: string;
  points: number[] = [];
  constructor(
               private route: ActivatedRoute,
               private locationService: LocationService,
               private proposalService: ProposalService
             ) {}
  id!: string;
  imageUrl:any;
  proposalData:any[]=[]
  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
    this.proposalService.getProposalByLocationId(this.id).subscribe((res:any)=>{
      // console.log(res)
      if(res.Message=="No Data"){
        console.log('No Client Available')
      }else{
        this.extractProposalData(res);
        // console.log(this.proposalData)s
      }


    })
  }
  private extractProposalData(res: any): void {
    for (const proposal of res) {
      if (proposal.seatsData && proposal.seatsData.length > 0 && proposal.seatSize) {
        const proposalObject = {
            clientName:proposal.clientName,
            totalNumberOfSeats:proposal.totalNumberOfSeats,
            seatsData:   proposal.seatsData,
            seatSize: proposal.seatSize,
            color: proposal.color,
        };
        this.proposalData.push(proposalObject);
    }
    }
  }
  ngAfterViewInit(): void {
    this.locationService.getImageById(this.id).subscribe(
      (imageUrl) => {
        this.imageUrl = environment.baseUrl+'images/' + imageUrl;
        // console.log(this.imageUrl);
        const imageObj = new Image();
    imageObj.onload = () => {
      this.initializeKonva(imageObj);
      this.enableZoom(); // Add this line to enable zoom
      this.drawTHeSeat()
    };

    imageObj.src = this.imageUrl;
      },
      error => {
        console.error('Error loading image data:', error);
        // Handle the error as needed
      }
    );


  }

  backgroundImage!: Konva.Image;
  initializeKonva(imageObj: HTMLImageElement): void {
    this.stage = new Konva.Stage({
      container: 'container',
      width: this.customWidth,
      height: this.customHeight,
    });

    this.layer = new Konva.Layer({
      name: 'firstLayer',
    });
    this.stage.add(this.layer);

    this.backgroundImage = new Konva.Image({
      image: imageObj,
      width: this.customWidth,
      height: this.customHeight,
    });

    this.layer.add(this.backgroundImage);
    this.layer.draw();
  }
  enableZoom(): void {
    const scaleBy = 1.1; // Adjust the scale factor as needed
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();

      const oldScale = this.stage.scaleX();
      const pointer: any = this.stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1; // Adjust the direction for standard zoom behavior

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      this.stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.stage.position(newPos);
      this.stage.batchDraw();
    });
  }
  resetZoomAndPosition(): void {
    // Set the initial scale and position values as per your original configuration
    const initialScale = 1;
    const initialPosition = { x: 0, y: 0 };

    this.stage.scale({ x: initialScale, y: initialScale });
    this.stage.position(initialPosition);
    this.stage.batchDraw();
  }
  drawTHeSeat(){
    // let dataOfDrawingSeats = this.proposalData.
    this.proposalData.forEach(dataOfSeats=>{
        this.drawSelectedRoom(dataOfSeats.seatsData,dataOfSeats.color,dataOfSeats.clientName)
    })

  }
  drawSelectedRoom(drawnSeats:any[],color:any,clientName:any) {
    drawnSeats.forEach(point=>{
      let rect = new Konva.Rect({
        x:point.x,
        y: point.y,
        width: point.width,
        height: point.height,
        fill:color,
        opacity:0.5,
        draggable:true

      })
      this.layer.add(rect);
    
      rect.moveToTop()
      this.layer.draw()
    })
    // let clientNameTitle = new Konva.Text({
    //   x:drawnSeats[0].point.x+10,
    //   y:drawnSeats[0].point.y+20,
    // })

  }
}
