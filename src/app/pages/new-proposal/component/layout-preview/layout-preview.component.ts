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
layoutData:any[]=[]
      getImageAndInitialize(locationId:any,layoutArray:any){
        this.seatWidth=layoutArray[0].seatWidth;
        this.seatHeight=layoutArray[0].seatHeight;
        this.locationService.getImageById(locationId).subscribe(
            (imageUrl) => {
              this.imageUrl = environment.baseUrl+'images/' + imageUrl;
              this.proposalService.getProposalByLocationId(locationId).subscribe(
                (result:any)=>{
                  if(result.Message=='No Data'){
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
                this.enableZoom();
                this.drawTheSeat();
                this.seprateData()
                this.layoutData=layoutArray[0].layoutBorder
                this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
                this.drawRoomsInRectangle()
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
               this.layoutData=layoutArray[0].layoutBorder
                this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
                this.drawRoomsInRectangle()
              };
              imageObj.src = this.imageUrl;
              imageObj.crossOrigin = 'Anonymous';// cors error if removed
                  }
            },
            error => {
              console.error('Error loading image data:', error);
            }
          );
        });
      }
      //drawSeats
      drawingEnabled: boolean = true;
      lastCoordinate:any[]=[]
      // drawnSeats:any[]=[]
      changeTheFlow(){
        this.flowOfDrawingSeats=!this.flowOfDrawingSeats
      }
      saveImage(){
        const image=this.stage.toDataURL()
        let data={
          image:String(image),
          // drawnSeats:this.drawnSeats,
          drawnSeats:this.drawnRooms,
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
            this.roomDetails.sort((a, b) => a.priority - b.priority);
          }
        }
      }
      // console.log(this.roomDetails,"HIII")
      }
//blank seats are drawn at selected clients
      drawTheSeat() {
        this.displayTotal=this.totalNumber
        this.proposalData.forEach(dataOfSeats => {
          dataOfSeats.seatsData.forEach((seat: any) => {
              const seatRect = new Konva.Rect({
                x: seat.x,
                y: seat.y,
                width: seat.width,
                height: seat.height,
                fill:'white', // Use the room's color
                opacity: 1,
              });
              this.layer.add(seatRect);
              seatRect.cache()
            // }
          });
        });

        this.layer.batchDraw();
      }
//for zooming
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
      displayTotal!:number;

      drawRoomsInRectangle() {
        let remainingRooms = this.totalNumber;
        let creatTotalOfRoom=0;
        let roomCanBeUsed:any[]=[]
      for(  let point of this.layoutData){
        if(point.isFull==false){


          if (!this.stage || !this.layer) return;
          if (this.drawingEnabled === true) {
            let seatWidth1 = point.seatPosition ? this.seatWidth : this.seatHeight;
            let seatHeight1 = point.seatPosition ? this.seatHeight : this.seatWidth;
            const availableWidth = point.endX - point.startX;
            const availableHeight = point.endY - point.startY;
            const maxHorizontalRooms = Math.floor(availableWidth / seatWidth1);
            const maxVerticalRooms = Math.floor(availableHeight /seatHeight1);
            const maxRectangles = maxHorizontalRooms * maxVerticalRooms;
            // console.log(maxRectangles,"==",maxVerticalRooms,"X",maxHorizontalRooms)

            creatTotalOfRoom+=maxRectangles

            if(creatTotalOfRoom>=this.displayTotal){
              roomCanBeUsed.push(point)
              break
            }else{
              point.isFull=true
              roomCanBeUsed.push(point)
            }
          }

        }else{
          let rect=new Konva.Rect({
            x:point.startX,
            y:point.startY,
            width:point.rectWidth,
            height:point.rectHeight,
            fill:"white",
          })
          this.layer.add(rect)
        }
      }
        roomCanBeUsed.forEach(point=>{
          // console.log(point)
          let startX = point.startX;
          let startY = point.startY;
          let prevRoom = null;
          let saveRooms=null
            // Sort the rooms by count in descending order
            this.roomDetails.sort((a, b) => b.count - a.count);

            for (const room of this.roomDetails) {
              if (remainingRooms > 0) {
                const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
                const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
                const availableWidth = point.endX - point.startX;
                const availableHeight = point.endY - point.startY;
                // Adjust room dimensions based on seat position
                let roomWidth = point.seatPosition ? room.dimensions.width * seatWidth : room.dimensions.height * seatWidth;
                let roomHeight = point.seatPosition ? room.dimensions.height * seatHeight : room.dimensions.width * seatHeight;
                let firstHalf;
                let secondHalf=null;
                  const roomsToDraw = room.selectedCount;

                  for (let i = 0; i < roomsToDraw; i++) {
                    // Check if drawing the room would extend beyond endY, skip to the next room
                    if (startY + roomHeight > point.endY + 1) {
                      continue;
                    }
                    if(room.dimensions.width==2 && roomWidth<=(availableWidth/2)){
                      continue

                    }else if(room.title!=="Workstation4x2" && room.dimensions.width==2){
                      // startX=point.startX
                      // startY+=roomHeight
                    }
                    // Check if the current room is the same as the previously drawn room and seatPosition is true
                    if ( prevRoom && prevRoom.title === room.title && room.title !== 'Workstation4x2' && room.title !== 'Workstation3x2' && room.title !== 'Workstation5x2' && !point.seatPosition) {
                      // If x and y coordinates match, switch to the next column
                      if (prevRoom.x === room.x && prevRoom.y === room.y) {
                        startX += roomWidth;

                        // Check if switching to the next column extends beyond endX
                        if (startX + roomWidth >= point.endX + 1) {
                          // Skip to the next room if it extends beyond endX
                          startX = point.startX;
                          startY += roomHeight;
                        }
                      } else {
                        // If x and y coordinates don't match, stay in the same row and adjust startX
                        startX = prevRoom.x + prevRoom.dimensions.width;
                        if (startX + roomWidth > point.endX) {
                          // If the room would extend beyond endX, switch to the next row
                          startX = point.startX;
                          startY += roomHeight;
                        }
                      }
                    }

                    if (startX + roomWidth <= point.endX && startY + roomHeight <= point.endY + 1) {
                      if (prevRoom && prevRoom.title == room.title && room.title !== 'Workstation4x2'&& room.title !== 'Cubical') {
                        // console.log("prevRoom.title === room.title", prevRoom.title, room.title);

                        startX = point.startX;
                        // startY+=roomHeight

                      }
                      // Draw the room
                      this.drawRoomRectangle(startX, startY, roomWidth, roomHeight, room.color, room.title);
                      saveRooms = {
                        title: room.title,
                        x: startX,
                        y: startY,
                        dimensions: room.dimensions,
                        width:roomWidth,
                        height:roomHeight,
                        color: room.color,
                        priority: room.priority,
                        rectSequence:point.sequenceNo
                      };
                      // Update counts and positions
                      room.selectedCount--;
                      startX += roomWidth;
                      remainingRooms -= room.count;

                      // Save the current room as the previously drawn room
                      prevRoom = {
                        title: room.title,
                        x: startX,
                        y: startY,
                        dimensions: room.dimensions,
                        width:roomWidth,
                        height:roomHeight,
                        color: room.color,
                        priority: room.priority,
                        rectSequence:point.sequenceNo
                      };
                      room.drawn=true
                      this.drawnRooms.push(saveRooms);
                      // Check if there is remaining space and color it differently (e.g., red)

                      if (startX + roomWidth > point.endX + 1) {
                        startX = point.startX;
                        startY += roomHeight
                      } else if (startX + roomWidth < point.endX && room.selectedCount === 0) {
                        startX = point.startX;
                        startY += roomHeight;
                      }

                  }else if(roomWidth>availableWidth && room.dimensions.width>3){
                    firstHalf=availableWidth
                    secondHalf=roomWidth-firstHalf

                    if (prevRoom && prevRoom.title === room.title && room.title !== 'Workstation4x2' && prevRoom.x == startX) {
                      // console.log("prevRoom.title === room.title", prevRoom.title, room.title);
                      startX = point.startX;
                      startY+=roomHeight

                    }
                    this.drawRoomRectangle(startX, startY, firstHalf?firstHalf:roomWidth, roomHeight, room.color, room.title);
                    saveRooms = {
                      title: room.title,
                      x: startX,
                      y: startY,
                      dimensions: room.dimensions,
                      width:roomWidth,
                      height:roomHeight,
                      color: room.color,
                      priority: room.priority,
                      rectSequence:point.sequenceNo
                    };
                    // Update counts and positions
                    room.selectedCount--;
                    startX += roomWidth;
                    remainingRooms -= room.count;

                    // Save the current room as the previously drawn room
                    prevRoom = {
                      title: room.title,
                      x: startX,
                      y: startY,
                      dimensions: room.dimensions,
                      width:roomWidth,
                      height:roomHeight,
                      color: room.color,
                      priority: room.priority,
                      rectSequence:point.sequenceNo
                    };
                    room.drawn=true
                    this.drawnRooms.push(saveRooms);
                    // Check if there is remaining space and color it differently (e.g., red)
                    if(secondHalf){
                      startX = point.startX; // Reset startX to the beginning
                      startY += roomHeight; // Move to the next row
                      if(startY + roomHeight < point.endY){
                        this.drawRoomRectangle(startX, startY, secondHalf, roomHeight, room.color, secondHalf?'':room.title);
                        secondHalf=null
                      }else{
                        secondHalf=null
                      }

                    }
                    if (startX + roomWidth > point.endX + 1) {
                      startX = point.startX;
                      startY += roomHeight
                    } else if (startX + roomWidth < point.endX && room.selectedCount === 0) {
                      startX = point.startX;
                      startY += roomHeight;
                    }

                  }else if(roomWidth>availableWidth && room.dimensions.width>3){
                    firstHalf=availableWidth
                    secondHalf=roomWidth-firstHalf

                    if (prevRoom && prevRoom.title === room.title && room.title !== 'Workstation4x2' && prevRoom.x == startX) {
                      // console.log("prevRoom.title === room.title", prevRoom.title, room.title);
                      startX = point.startX;
                      startY+=roomHeight

                    }
                    this.drawRoomRectangle(startX, startY, firstHalf?firstHalf:roomWidth, roomHeight, room.color, room.title);
                    saveRooms = {
                      title: room.title,
                      x: startX,
                      y: startY,
                      dimensions: room.dimensions,
                      width:roomWidth,
                      height:roomHeight,
                      color: room.color,
                      priority: room.priority,
                      rectSequence:point.sequenceNo
                    };
                    // Update counts and positions
                    room.selectedCount--;
                    startX += roomWidth;
                    remainingRooms -= room.count;

                    // Save the current room as the previously drawn room
                    prevRoom = {
                      title: room.title,
                      x: startX,
                      y: startY,
                      dimensions: room.dimensions,
                      width:roomWidth,
                      height:roomHeight,
                      color: room.color,
                      priority: room.priority,
                      rectSequence:point.sequenceNo
                    };
                    room.drawn=true
                    this.drawnRooms.push(saveRooms);
                    // Check if there is remaining space and color it differently (e.g., red)
                    if(secondHalf){
                      startX = point.startX; // Reset startX to the beginning
                      startY += roomHeight; // Move to the next row
                      if(startY + roomHeight < point.endY){
                        this.drawRoomRectangle(startX, startY, secondHalf, roomHeight, room.color, secondHalf?'':room.title);
                        secondHalf=null
                      }else{
                        secondHalf=null
                      }

                    }
                    if (startX + roomWidth > point.endX + 1) {
                      startX = point.startX;
                      startY += roomHeight
                    } else if (startX + roomWidth < point.endX && room.selectedCount === 0) {
                      startX = point.startX;
                      startY += roomHeight;
                    }

                  }


                }
              }
            }

            this.totalNumber = remainingRooms;
            this.layer.batchDraw();
        })

        // roomCanBeUsed.sort((a:any,b:any)=>b.sequenceNo-a.sequenceNo)




      }


      drawRoomRectangle(x: number, y: number, width: number, height: number, fill: string,title:string) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: fill,
          opacity: 0.3,
          stroke: 'black',  // You can customize the stroke color
          strokeWidth: 0.5, // You can customize the stroke width
          name: `room-rectangle-${title}`,
          draggable:true
        });

        this.layer.add(rect);
        if(title!=='Workstation4x2'){
          let titleOfRoom = new Konva.Text({
            x:x,
            y:y,
            height:height,
            text: `${title}`,
            fontSize: 6,
            width:width,
            align : "center",
            verticalAlign:"middle",
            fontFamily:'Courier New',
            name:'room-names',
            wrap:`${title}`
          })
          this.layer.add(titleOfRoom)
        }

      }

    hideName(){
      let roomNames=this.layer.find('.room-names');
      roomNames.forEach(room=>{
        if(room.visible()){
          room.hide();
        }else{
          room.show()
        }

      })
    }
}
