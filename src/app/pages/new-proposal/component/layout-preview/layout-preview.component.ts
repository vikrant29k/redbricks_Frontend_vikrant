import { Component, OnInit, Inject,AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from "src/environments/environment";
import * as roomsData from '../../../location/component/layout-editor/seat-draw/roomCountsData.json'
export interface RoomData {
  [key: string]: {
    count: number;
    color: string;
  };
}
export interface DialogData {
    locationId: string,
    proposalId:string,
    totalNoOfSeat:number,
    content:any;
}

@Component({
    selector: 'new-proposal-layout-preview',
    templateUrl: './layout-preview.component.html',
    styleUrls: ['./layout-preview.component.scss']
})
export class NewProposalLayoutPreviewComponent implements OnInit, AfterViewInit {
    id!: string;
    flowOfDrawingSeats:boolean=true;
    imageUrl:any;
    stage!: Konva.Stage;
    layer!: Konva.Layer;
    line!: Konva.Line;
    customWidth = 1080;
    customHeight = 734;
    backgroundImage!: Konva.Image;
    transformer!: Konva.Transformer;
    getAllPoints:any[]=[]
    totalNumber!:number;
  seatWidth!: number;
  seatHeight!: number;
  setButtonDisable: boolean= false;
    ngAfterViewInit(): void {

      }
      // onRadioButtonChange(event:any) {
      //   console.log("onRadioButtonChange()");
      //   console.log("event.source=" + event.source.id);
      //   console.log("event.value=" + event.value);
      //   this.flowOfDrawingSeats = event.value
      //   // this.getDrawingMode()
      // }
    constructor(
        public dialogRef: MatDialogRef<NewProposalLayoutPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private proposalService: ProposalService,
        private locationService:LocationService
    ) { }
    proposalData:any[]=[]
    private extractProposalData(res: any): void {
      for (const proposal of res) {
        if (proposal.seatsData && proposal.seatsData.length > 0 && proposal.seatSize) {
          const proposalObject = {
              seatsData: proposal.seatsData,
              seatSize: proposal.seatSize,
          };
          this.proposalData.push(proposalObject);
      }
      }
    }
    ngOnInit(): void {
        this.totalNumber=this.data.totalNoOfSeat;
        this.content=this.data.content;
        this.proposalService.generateLayout(this.data.proposalId).subscribe((res:any)=>{
              this.getImageAndInitialize(res.locationId,res.layoutArray)

        })

    }
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
//intialize the image and stage and layer
      getImageAndInitialize(locationId:any,layoutArray:any){
        this.seatWidth=layoutArray[0].seatWidth;
        this.seatHeight=layoutArray[0].seatHeight;
        layoutArray[0].layoutBorder.forEach((item:any) => {
          const {_id, startX, startY, endX, endY,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull } = item;
          this.getAllPoints.push({_id, startX, startY, endX, endY,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull });
});
        this.locationService.getImageById(locationId).subscribe(
            (imageUrl) => {
              this.imageUrl = environment.baseUrl+'images/' + imageUrl;
              this.proposalService.getProposalByLocationId(locationId).subscribe(
                (result:any)=>{
                  if(result.Message=='No Data'){
                    // console.log("Ny tyt data ky")
                         //   console.log(this.imageUrl);
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
                this.drawTheBlankSeat()
                this.transformer = new Konva.Transformer(); // Initialize transformer
                this.layer.add(this.transformer);
                for (const shape of layoutArray[0].layoutBorder) {
                  // this.seatSizeHeight=shape.seatHeight;
                  // this.seatSizeWidth=shape.seatWidth
                  // const shape  = layoutBorderObj.attrs
                  const rect = new Konva.Rect({
                    x: shape.startX,
                    y: shape.startY,
                    width: shape.rectWidth,
                    height: shape.rectHeight,
                    fill: 'transparent',
                    opacity: 0.05,
                  });
                  rect.on('click', (e) => {
                    this.drawSeatsInRectangle(shape, e.evt.offsetX, e.evt.offsetY);
                  });
                  this.layer.add(rect);
              }
              };
              imageObj.src = this.imageUrl;
              imageObj.crossOrigin = 'Anonymous';
                  }else{
                    this.extractProposalData(result);
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
                this.drawTheBlankSeat()
                this.transformer = new Konva.Transformer(); // Initialize transformer
                this.layer.add(this.transformer);
                for (const shape of layoutArray[0].layoutBorder) {
                  const rect = new Konva.Rect({
                    x: shape.startX,
                    y: shape.startY,
                    width: shape.rectWidth,
                    height: shape.rectHeight,
                    fill: 'transparent',
                    opacity: 0.05,
                  });
                  rect.on('click', (e) => {
                    // console.log(e,"RUNNINNG")
                    this.drawSeatsInRectangle(shape, e.evt.offsetX, e.evt.offsetY);
                  });
                    this.layer.add(rect);
            }
              };
              imageObj.src = this.imageUrl;
              imageObj.crossOrigin = 'Anonymous';
              // this.drawRectangles()
                  }
            },
            error => {
              console.error('Error loading image data:', error);
              // Handle the error as needed
            }
          );
        });
      }
      //drawSeats
      drawingEnabled: boolean = true;
      lastCoordinate:any[]=[]
      drawnSeats:any[]=[]
      changeTheFlow(){
        this.flowOfDrawingSeats=!this.flowOfDrawingSeats
      }
      drawSeatsInRectangle(point: any, clickX: number, clickY: number) {
        // console.log(point,"YUPP")
        let count = 0;
          const x = clickX; // X coordinate of the click
          const y = clickY; // Y coordinate of the click
        if (!this.stage || !this.layer) return;
        if (this.drawingEnabled === true) {
          let remainingSeats = this.totalNumber;
            const minX = point.startX;
            const minY = point.startY;
            const maxX = point.endX;
            const maxY = point.endY;


            const availableWidth = maxX - minX;
            const availableHeight = maxY - minY;
            const maxHorizontalRectangles = Math.round(availableWidth / this.seatWidth);
            const maxVerticalRectangles = Math.round(availableHeight / this.seatHeight);

            const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;

            const flowOfData = this.flowOfDrawingSeats;
            if (x < maxX && x > minX && y > minY && y < maxY) {
              const polygon = new Konva.Line({
                points: this.getAllPoints,
                fill: 'transparent',
                stroke: 'black',
                strokeWidth:0.3,
              });
              this.layer.add(polygon);
            if (flowOfData == true) {
              const columns:number = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
              const seatWidth:number = point.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
                const seatHeight:number = point.seatPosition ? this.seatHeight :this.seatWidth;
              for (let column:number = 0; column < columns; column++) {
                for (let y:number = minY; y < maxY-10  ; y += seatHeight) {
                  const x = minX + column * seatWidth;
                  if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width:seatWidth, height: seatHeight }, polygon.getClientRect())) {
                    this.drawSeatRectangle(x, y,seatHeight,seatWidth);
                    this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + seatWidth, y: y + seatHeight },workStatkionID: point._id,seatPosition:point.seatPosition });

                    remainingSeats--;
                    count++;
                  }
                }
              }
            }
            else {

              const rows = Math.min(Math.ceil(remainingSeats / maxHorizontalRectangles), maxVerticalRectangles);
              const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
              const seatHeight = point.seatPosition ? this.seatHeight :this.seatWidth;
              for (let row = 0; row < rows; row++) {
                for (let x = minX; x < maxX - 10; x += seatWidth) {
                  const y = minY + row * seatHeight;

                  if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: seatWidth, height: seatHeight }, polygon.getClientRect())) {
                    this.drawSeatRectangle(x, y,seatHeight,seatWidth);
                    this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + seatWidth, y: y + seatHeight },workStatkionID: point._id,seatPosition:point.seatPosition });

                    remainingSeats--;
                    count++;

                  }
                }
              }
            }
            this.totalNumber=remainingSeats;
          this.layer.batchDraw();
        }
        }
      }


      drawSeatRectangle(x:number, y:number,height:number,width:number) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: 'blue',
          opacity: 0.3,
          stroke: 'red',
          strokeWidth: 0.4,
          name: 'seat-rectangle',
        });
        this.layer.add(rect);
        // rect.cache() //for code optimization
      }

      saveImage(){
        const image=this.stage.toDataURL()
        let data={
          image:String(image),
          drawnSeats:this.drawnSeats,
          seatSize:[{
           height: this.seatHeight,
           width:this.seatWidth
          }]
        }
        this.proposalService.saveImage(this.data.proposalId,data).subscribe(res=>{
          this.dialogRef.close(true)
              // console.log(res)
            })
      }

      drawTheBlankSeat(){
         this.proposalData.forEach(dataOfSeats=>{
          for (const seat of dataOfSeats.seatsData) {
           this.drawSeatsBetweenPoints(seat.start, seat.end);
          }
        })

      }
      drawSeatsBetweenPoints(start:any, end:any) {

        const startX = Math.min(start.x, end.x);
        const startY = Math.min(start.y, end.y);
        const endX = Math.max(start.x, end.x);
        const endY = Math.max(start.y, end.y);
        const seatSizeWidth = this.seatWidth; // Extract width from seatSize
        const seatSizeHeight = this.seatHeight; // Extract height from seatSize
        for (let x = startX; x < endX; x += seatSizeWidth) {
          for (let y = startY; y < endY; y += seatSizeHeight) {
            this.drawBlankSeatRect(x, y,seatSizeHeight,seatSizeWidth);
          }
        }
      }

      drawBlankSeatRect(x:any, y:any, height:number, width:number) {
        // console.log(x,y)

        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: 'white',
          opacity: 1,
          name: 'blank-rectangle',
        });
        this.layer.add(rect);

      }
      content:any;

  sepratedContent:any[]=[]
      roomsDataObject: RoomData = roomsData;

      seprateData(){
        console.log(this.content)
        const contentArray = this.content.split(','); // Split the string into an array
        contentArray.forEach((item:any) => {
          const keyValue = item.trim().split('=');
          if (keyValue.length === 2) {
            const key = keyValue[0].trim();
            const value = parseInt(keyValue[1].trim()); // Assuming the values are integers
            this.sepratedContent[key] = value;
          }
        });

        // Now you have separated content as an object with individual properties
        console.log("YEP",this.sepratedContent);


        const commonObjectsWithCounts = [];

        for (const key in this.sepratedContent) {
          if (this.sepratedContent.hasOwnProperty(key)) {
            // Check if the key exists in the JSON data
            if (this.roomsDataObject[key]) {
              const count = this.sepratedContent[key];
              const jsonData = this.roomsDataObject[key];

              // Create a new object with the multiplied count and color
              const commonObject = {
                title: key,
                count: jsonData.count * count,
                color: jsonData.color,
              };

              // Add the common object to the array
              commonObjectsWithCounts.push(commonObject);
            }
          }
        }

        // Now you have an array commonObjectsWithCounts containing common objects
        console.log(commonObjectsWithCounts);
        this.assignRoomsToSeats(commonObjectsWithCounts)
          }
          assignRoomsToSeats(commonObjectsWithCounts: any[]) {
            // Find all seat rectangles in the layer
            const seatRectangles = this.layer.find('.seat-rectangle');

            let currentSeatIndex = 0;

            commonObjectsWithCounts.forEach((room: any) => {
              const roomSeats = [];
              for (let i = 0; i < room.count; i++) {
                const seat: any = seatRectangles[currentSeatIndex];
                if (seat) {
                  roomSeats.push(seat);
                  seat.fill(room.color); // Assign the room's color to the seat
                } else {
                  break; // No more seats available for this room
                }
                currentSeatIndex++;
              }
              // You can do something with roomSeats (e.g., save them in a data structure)
            });

            // Redraw the layer to apply the changes to seat colors
            this.layer.batchDraw();
          }
}
