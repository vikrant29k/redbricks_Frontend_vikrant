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
  constructor(private router: Router,
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
      this.extractProposalData(res);
      // console.log(this.proposalData)

    })
  }
  private extractProposalData(res: any): void {
    for (const proposal of res) {
      if (proposal.seatsData && proposal.seatsData.length > 0 && proposal.seatSize) {
        const proposalObject = {
            clientName:proposal.clientName,
            totalNumberOfSeats:proposal.totalNumberOfSeats,
            seatsData: proposal.seatsData.map((seat:any, index:any) => ({
                ...seat,
                first: index === 0, // Set "first" to true for the first object, false for others
            })),
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
   console.log(dataOfSeats)
      for (const seat of dataOfSeats.seatsData) {

        this.drawSeatsBetweenPoints(seat.start, seat.end,dataOfSeats.seatSize, dataOfSeats.color, seat.first,dataOfSeats.clientName,dataOfSeats.totalNumberOfSeats);
      }
    })

  }
  drawSeatsBetweenPoints(start:any, end:any,seatSize:any,color:any, index:any, clientName:string,totalNumberOfSeats:number) {

    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
    const seatSizeWidth = seatSize[0].width; // Extract width from seatSize
    const seatSizeHeight = seatSize[0].height; // Extract height from seatSize
    for (let x = startX; x < endX; x += seatSizeWidth) {
      for (let y = startY; y < endY; y += seatSizeHeight) {
        this.drawSeatRectangle(x, y,color,seatSizeHeight,seatSizeWidth,index,clientName,totalNumberOfSeats);
      }
    }
  }

  drawSeatRectangle(x:any, y:any, fill:string, height:number, width:number, index:any, clientName:string,totalNumberOfSeats:number) {
    // console.log(x,y)

    console.log(fill)
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      opacity: 0.5,
      name: 'seat-rectangle',
    });
    this.layer.add(rect);
if(index==true){
  const text = new Konva.Text({
    x: x - width / 2,
    y: y + height / 2,
    text: clientName,
    fontSize: 16,
    fill: 'black',
    align: 'center',
});
const totalSeatsText = new Konva.Text({
  x: x,
  y: y + height + 10, // Adjust the y value as needed
  text: `Total Seats: ${totalNumberOfSeats}`,
  fontSize: 14,
  fill: 'black',
  align: 'center',
});
totalSeatsText.offsetX(totalSeatsText.width() / 2);
this.layer.add(totalSeatsText);
text.offsetX(text.width() / 2);
text.offsetY(text.height() / 2);
this.layer.add(text);
}

  }
}
