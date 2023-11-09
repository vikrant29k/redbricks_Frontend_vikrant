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
                this.enableZoom();
                this.drawTheSeat()
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
                this.enableZoom();
                this.drawTheSeat()
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
            // if (x < maxX && x > minX && y > minY && y < maxY) {
              const polygon = new Konva.Line({
                points: [point],
                fill: 'transparent',
                stroke: 'black',
                strokeWidth:0.3,
              });
              this.layer.add(polygon);
            if (flowOfData == true) {
              const columns = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
            const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
                const seatHeight = point.seatPosition ? this.seatHeight :this.seatWidth;
              for (let column = 0; column < columns; column++) {
                for (let y = minY; y < maxY-10  ; y += seatHeight) {
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
                for (let x = minX; x < maxX-10; x += seatWidth) {
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
        // }
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
        rect.cache() //for code optimization
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




      drawTheSeat() {
        this.proposalData.forEach(dataOfSeats => {

          dataOfSeats.seatsData.forEach((seat: any) => {

              const seatRect = new Konva.Rect({
                x: seat.start.x,
                y: seat.start.y,
                width: dataOfSeats.seatSize[0].width,
                height: dataOfSeats.seatSize[0].height,
                fill:'white', // Use the room's color
                opacity: 1,

              });

              this.layer.add(seatRect);
            // }
          });
        });

        this.layer.batchDraw();


      }



      enableZoom(): void {
        const scaleBy = 1.1; // Adjust the scale factor as needed
        this.stage.on('wheel', (e) => {
          e.evt.preventDefault();
console.log(e)
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


      content:any;

}
