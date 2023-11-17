// Almost working code for drawing rooms
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
    width:number;
    height:number;
    priority:number
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
  content:any;
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
        this.locationService.getImageById(locationId).subscribe(
            (imageUrl) => {
              this.imageUrl = environment.baseUrl+'images/' + imageUrl;
              this.proposalService.getProposalByLocationId(locationId).subscribe(
                (result:any)=>{
                  if(result.Message=='No Data'){
                         //   console.log(this.imageUrl);
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
                this.enableZoom();
                this.drawTheSeat();
                this.seprateData()
                this.transformer = new Konva.Transformer(); // Initialize transformer
                this.layer.add(this.transformer);
                let layourData=layoutArray[0].layoutBorder
                layourData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
                for (const shape of layourData) {
                  if (shape.hasOwnProperty('sequenceNo')) {
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
                  // rect.on('click', (e) => {
                    // this.drawSeatsInRectangle(shape, e.evt.offsetX, e.evt.offsetY);

                  // });
                  this.layer.add(rect);
                  this.drawRoomsInRectangle(shape)
                }
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
                this.seprateData();
                this.drawTheSeat();
                this.transformer = new Konva.Transformer(); // Initialize transformer
                this.layer.add(this.transformer);
                let layourData=layoutArray[0].layoutBorder
                layourData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
                for (const shape of layourData) {
                  if (shape.hasOwnProperty('sequenceNo')) {
                  const rect = new Konva.Rect({
                    x: shape.startX,
                    y: shape.startY,
                    width: shape.rectWidth,
                    height: shape.rectHeight,
                    fill: 'transparent',
                    opacity: 0.05,
                  });
                  // rect.on('click', (e) => {\
                    // console.log(e,"RUNNINNG")
                    // this.drawSeatsInRectangle(shape, e.evt.offsetX, e.evt.offsetY);

                  // });
                    this.layer.add(rect);
                    this.drawRoomsInRectangle(shape)
                }
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
//read the content
roomDetails:any[]=[]
  sepratedContent:any[]=[]
  selectedRoom:any[]=[];
  showDataInHml:any[]=[]
  // roomTitles:any
  roomsDataObject: RoomData = roomsData;
    seprateData(){
      const contentArray = this.content.split(','); // Split the string into an array
      contentArray.forEach((item:any) => {
        const keyValue = item.trim().split('=');
        if (keyValue.length === 2) {
          const key = keyValue[0].trim();
          const value = parseInt(keyValue[1].trim()); // Assuming the values are integers
          this.sepratedContent[key] = value;
        }
      });
      // const commonObjectsWithCounts = [];
      for (const key in this.sepratedContent) {
        if (this.sepratedContent.hasOwnProperty(key)) {
          // Check if the key exists in the JSON data
          if (this.roomsDataObject[key]) {
            const count = this.sepratedContent[key];
            const jsonData = this.roomsDataObject[key];
            const commonObject = {
              title: key,
              count: jsonData.count,
              selectedCount:count,
              dimensions:{width:jsonData.width,height:jsonData.height},
              color: jsonData.color,
              drawn:false,
              priority:jsonData.priority
            };
            this.roomDetails.push(commonObject);
            // this.roomDetails.sort((a:any,b:any)=>b.count - a.count)
            this.roomDetails.sort((a, b) => b.priority - a.priority);
          }
        }
      }
      console.log(this.roomDetails,"HIII")
      }
//blank seats are drawn at selected clients
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
      drawnRooms: any[] = [];
      drawRoomsInRectangle(point: any) {
        let remainingRooms = this.totalNumber;

        let startX = point.startX;  // Use startX from the point object
        let startY = point.startY;  // Use startY from the point object

        if (!this.stage || !this.layer) return;

        if (this.drawingEnabled === true) {
            // Calculate the maximum number of rooms that can fit horizontally and vertically
            const availableWidth = point.endX - point.startX;
            const availableHeight = point.endY - point.startY;
            const maxHorizontalRooms = Math.floor(availableWidth / this.seatWidth);
            const maxVerticalRooms = Math.floor(availableHeight / this.seatHeight);
            const maxRectangles = maxHorizontalRooms * maxVerticalRooms;

            for (const room of this.roomDetails) {
                if (remainingRooms > 0) {
                  const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
                  const seatHeight = point.seatPosition ? this.seatHeight :this.seatWidth;
                    const roomWidth = room.dimensions.width * seatWidth;
                    const roomHeight = room.dimensions.height * seatHeight;
                    const totalRoomCount = room.count * room.selectedCount;
                    const roomsToDraw = room.selectedCount;

                    // Check the flowOfData to determine the drawing direction
                    if (this.flowOfDrawingSeats === true) {
                        for (let i = 0; i < roomsToDraw; i++) {
                            if (startX + roomWidth <= point.endX && startY + roomHeight <= point.endY+2) {
                                this.drawRoomRectangle(startX, startY, roomWidth, roomHeight, room.color);

                                // Subtract the drawn count from the selectedCount
                                room.selectedCount--;

                                // Remove the room from roomDetails if all instances are drawn
                                // if (room.selectedCount === 0) {
                                //     const roomIndex = this.roomDetails.indexOf(room);
                                //     // this.roomDetails.splice(roomIndex, 1);
                                // }

                                startX += roomWidth;
                                remainingRooms-=room.count;

                                // Add room-specific information to the drawnRooms array only if the room is successfully drawn
                                this.drawnRooms.push({
                                    title: room.title,
                                    dimensions: room.dimensions,
                                    color: room.color,
                                    priority: room.priority,
                                });

                                if (startX + roomWidth >= point.endX + 1) {
                                  console.log('StartX==>',startX,"+Room Width===>",roomWidth);
                                    startX = point.startX;
                                    startY += roomHeight; // Assuming you want to start a new row
                                }else  if(startX+roomWidth< point.endX && room.selectedCount==0){
                                  startX = point.startX;
                                  startY += roomHeight;
                                }


                            }
                        }
                        // console.log(this.roomDetails)
                    }
                    // else if (this.flowOfDrawingSeats === false) {
                    //     for (let i = 0; i < roomsToDraw; i++) {
                    //         if (startY + roomHeight <= point.endY && startX + roomWidth <= point.endX) {
                    //             this.drawRoomRectangle(startX, startY, roomWidth, roomHeight, room.color);

                    //             // Subtract the drawn count from the selectedCount
                    //             room.selectedCount--;

                    //             // Remove the room from roomDetails if all instances are drawn
                    //             if (room.selectedCount === 0) {
                    //                 const roomIndex = this.roomDetails.indexOf(room);
                    //                 this.roomDetails.splice(roomIndex, 1);
                    //             }

                    //             startY += roomHeight;
                    //             remainingRooms-=room.count;

                    //             // Add room-specific information to the drawnRooms array only if the room is successfully drawn
                    //             this.drawnRooms.push({
                    //                 title: room.title,
                    //                 dimensions: room.dimensions,
                    //                 color: room.color,
                    //                 priority: room.priority,
                    //             });

                    //             if (startY + roomHeight > point.endY + 1) {
                    //                 startY = point.startY;
                    //                 startX += roomWidth; // Assuming you want to start a new row
                    //             }
                    //         }
                    //     }
                    // }
                }
            }

            this.totalNumber = remainingRooms;
            // console.log(this.drawnRooms);s
            this.layer.batchDraw();
        }
    }

      drawRoomRectangle(x: number, y: number, width: number, height: number, fill: string) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: fill,
          opacity: 0.3,
          stroke: 'black',  // You can customize the stroke color
          strokeWidth: 0.5, // You can customize the stroke width
          name: 'room-rectangle',
          draggable:true
        });

        this.layer.add(rect);
      }


}
