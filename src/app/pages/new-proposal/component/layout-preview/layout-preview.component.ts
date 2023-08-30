import { Component, OnInit, Inject,AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProposalService } from "src/app/service/proposal/proposal.service"; 
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
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
    flowOfDrawingSeats:string = 'vertical';
    imageUrl:any;
    stage!: Konva.Stage;
    layer!: Konva.Layer;
    line!: Konva.Line;
    customWidth = 800;
    customHeight = 566;
    backgroundImage!: Konva.Image;
    transformer!: Konva.Transformer;
    getAllPoints:any[]=[]
    totalNumber!:number;
  seatSizeWidth!: number;
  seatSizeHeight!: number;
  setButtonDisable: boolean= false;
    ngAfterViewInit(): void { 
        
      }
      onRadioButtonChange(event:any) {
        console.log("onRadioButtonChange()");
        console.log("event.source=" + event.source.id);
        console.log("event.value=" + event.value);
        this.flowOfDrawingSeats = event.value
        // this.getDrawingMode()
      }
    constructor(
        public dialogRef: MatDialogRef<NewProposalLayoutPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private proposalService: ProposalService,
        private locationService:LocationService
    ) { }

    ngOnInit(): void {
        // this.id=this.data.locationId;
        this.totalNumber=this.data.totalNoOfSeat;

        this.proposalService.generateLayout(this.data.proposalId).subscribe((res:any)=>{
            // console.log(res)
            this.getImageAndInitialize(res.locationId,res.shapes)
            const sizeOfSeat = res.seatSize;
              this.seatSizeHeight=sizeOfSeat[0].height;
              this.seatSizeWidth=sizeOfSeat[0].width;
              res.layoutArray.forEach((item:any) => {
                const { startX, startY, endX, endY, _id } = item;
                this.getAllPoints.push({ _id,startX, startY, endX, endY });
            });
              
            console.log(this.getAllPoints);
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
      getImageAndInitialize(locationId:any, drawRect:any){
        this.locationService.getImageById(locationId).subscribe(
            (imageUrl) => {
              this.imageUrl = 'http://192.168.29.233:3000/images/' + imageUrl;
            //   console.log(this.imageUrl);
              const imageObj = new Image();
          imageObj.onload = () => {
            this.initializeKonva(imageObj);
            // this.enableZoom(); // Add this line to enable zoom
            // this.enablePanning(); // Add this line to enable panning
            this.transformer = new Konva.Transformer(); // Initialize transformer
            this.layer.add(this.transformer);
            for (const layoutBorderObj of drawRect) {
               
                // Extract start and end points from the layoutBorder shape
                const shape  = layoutBorderObj.attrs
               
                // Push the points into the getAllPoints array
                // this.getAllPoints.push(shape);
                // this.getAllPoints.push({})
                const rect = new Konva.Rect({
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height,
                    fill: shape.fill,
                    opacity: shape.opacity,
                    stroke: shape.stroke,
                    strokeWidth: shape.strokeWidth,
                    name: shape.name,
                    draggable: false // Set draggable as needed
                });
    
                this.layer.add(rect);
        }
          //   this.getLayout();
          };
      
          imageObj.src = this.imageUrl;
          imageObj.crossOrigin = 'Anonymous';
          // this.drawRectangles()
            },
            error => {
              console.error('Error loading image data:', error);
              // Handle the error as needed
            }
          );
      }
      //drawSeats 
      drawingEnabled: boolean = true;
      lastCoordinate:any[]=[]
      drawnSeats:any[]=[]
      drawRectangles() {
        let count = 0;
        this.stage.on('click', (e: any) => {
          const x = e.evt.offsetX; // X coordinate of the click
          const y = e.evt.offsetY; // Y coordinate of the click
       
        if (!this.stage || !this.layer) return;
        if (this.drawingEnabled === true) {
          // const polygon = new Konva.Line({
          //   points: this.getAllPoints,
          //   fill: 'transparent',
          //   stroke: 'black',
          //   strokeWidth: 0.3,
          // });
          // this.layer.add(polygon);
      
          let remainingSeats = this.totalNumber;
      
          for (const point of this.getAllPoints) {
            const minX = point.startX;
            const minY = point.startY;
            const maxX = point.endX;
            const maxY = point.endY;
      
            const availableWidth = maxX - minX;
            const availableHeight = maxY - minY;
            const maxHorizontalRectangles = Math.floor(availableWidth / this.seatSizeWidth);
            const maxVerticalRectangles = Math.floor(availableHeight / this.seatSizeHeight);
      
            const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;
            console.log("HEllO==>",maxRectangles);
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
            if (flowOfData == 'vertical') {
              const columns = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
      
              for (let column = 0; column < columns; column++) {
                for (let y = minY; y < maxY - 10  ; y += this.seatSizeHeight) {
                  const x = minX + column * this.seatSizeWidth;
      
                  if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: this.seatSizeWidth, height: this.seatSizeHeight }, polygon.getClientRect())) {
                    this.drawSeatRectangle(x, y);
                    this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + this.seatSizeWidth, y: y + this.seatSizeHeight },workStatkionID: point._id });

                    remainingSeats--;
                    count++;
                    if(this.totalNumber==count){
                      this.lastCoordinate.push({
                        lastX:x+this.seatSizeWidth,
                        lastY:y+this.seatSizeHeight
                      })
                    }
                  }
                }
              }
            } else {
          
              const rows = Math.min(Math.ceil(remainingSeats / maxHorizontalRectangles), maxVerticalRectangles);
      
              for (let row = 0; row < rows; row++) {
                for (let x = minX; x < maxX - 10; x += this.seatSizeWidth) {
                  const y = minY + row * this.seatSizeHeight;
      
                  if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: this.seatSizeWidth, height: this.seatSizeHeight }, polygon.getClientRect())) {
                    this.drawSeatRectangle(x, y);
                    this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + this.seatSizeWidth, y: y + this.seatSizeHeight },workStatkionID: point._id });

                    remainingSeats--;
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
      
          this.layer.draw();
        }
        }})
      }
      
      drawSeatRectangle(x:number, y:number) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: this.seatSizeWidth,
          height: this.seatSizeHeight,
          fill: 'blue',
          opacity: 0.3,
          stroke: 'red',
          strokeWidth: 0.4,
          name: 'seat-rectangle',
        });
        this.layer.add(rect);
      }

      saveImage(){
        const image=this.stage.toDataURL()
        let data={
          image:String(image),
          drawnSeats:this.drawnSeats,
          seatSize:[{
           height: this.seatSizeHeight,
           width:this.seatSizeWidth
          }]
        }
        this.proposalService.saveImage(this.data.proposalId,data).subscribe(res=>{
          this.dialogRef.close(true)
              console.log(res)
            })
      }
      
      
}
