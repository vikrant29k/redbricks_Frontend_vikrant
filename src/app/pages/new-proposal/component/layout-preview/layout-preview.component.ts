import { Component, OnInit, Inject,AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from "src/environments/environment";
export interface DialogData {
    locationId: string,
    proposalId:string,
    totalNoOfSeat:number
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
                  if(result.message=='no data'){
                    // console.log("Ny tyt data ky")
                         //   console.log(this.imageUrl);
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
                this.drawTheBlankSeat()
                this.transformer = new Konva.Transformer(); // Initialize transformer
                this.layer.add(this.transformer);
                // console.log(layoutArray,"HELOOOE")
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

                  this.layer.add(rect);
              }

              };
              imageObj.src = this.imageUrl;
              imageObj.crossOrigin = 'Anonymous';
              // this.drawRectangles()
                  }else{
                    this.extractProposalData(result);
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
      drawRectangles() {
        let count = 0;
        this.stage.on('click', (e: any) => {
          const x = e.evt.offsetX; // X coordinate of the click
          const y = e.evt.offsetY; // Y coordinate of the click

        if (!this.stage || !this.layer) return;
        if (this.drawingEnabled === true) {
          let remainingSeats = this.totalNumber;

          for (const point of this.getAllPoints) {

            const minX = point.startX;
            const minY = point.startY;
            const maxX = point.endX;
            const maxY = point.endY;
            // console.log("name of rect",point._id,
                        // "\n minX=",point.startX,
                        // "\n maxX=>",point.endX,
                        // "\n width of rect=>", point.endX-point.startX);
            // console.log("MAX Columns can be added==>",Math.round((maxX-minX)/point.seatWidth))

            const availableWidth = maxX - minX;
            const availableHeight = maxY - minY;
            const maxHorizontalRectangles = Math.floor(availableWidth / point.seatWidth);
            const maxVerticalRectangles = Math.floor(availableHeight / point.seatHeight);

            const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;
            console.log(maxRectangles,"HECH TE ")
            const flowOfData = this.flowOfDrawingSeats;
            if (x < maxX && x > minX && y > minY && y < maxY) {
              const polygon = new Konva.Line({
                points: this.getAllPoints,
                fill: 'transparent',
                stroke: 'black',
                strokeWidth:0.3,
                // draggable:true,
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
                    // if(this.totalNumber==count){
                    //   this.lastCoordinate.push({
                    //     lastX:x+seatWidth,
                    //     lastY:y+seatHeight
                    //   })
                    // }
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
                    // if(this.totalNumber==count){
                    //   this.lastCoordinate.push({
                    //     lastX:x+seatWidth,
                    //     lastY:y+seatHeight
                    //   })
                    // }
                  }
                }
              }
            }
            this.totalNumber=remainingSeats;
            if (remainingSeats === 0) {
              this.drawingEnabled = false;
              break;
            }
          }

          this.layer.batchDraw();
        }
        }})
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

      drawTheBlankSeat(){
        // let dataOfDrawingSeats = this.proposalData.
        this.proposalData.forEach(dataOfSeats=>{
      //  console.log(dataOfSeats)
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
}
