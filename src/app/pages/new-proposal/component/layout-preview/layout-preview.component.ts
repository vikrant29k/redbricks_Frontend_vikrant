// Almost working code for drawing rooms
import { Component, OnInit, Inject } from "@angular/core";
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
export class NewProposalLayoutPreviewComponent implements OnInit {
    id!: string;
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
  content:any;
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
    minThreshold:any;
    maxThreshold:any;
    ngOnInit(): void {
        this.totalNumber=this.data.totalNoOfSeat;
        this.displayTotal=this.totalNumber;
        this.minThreshold=this.displayTotal-(5/100) *this.displayTotal
        this.maxThreshold=this.displayTotal-(10/100) *this.displayTotal
        console.log(this.minThreshold,this.maxThreshold)
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
                this.seprateData()
                this.layoutData=layoutArray[0].layoutBorder
                layoutArray[0].pillarsData.forEach((item:any)=>{
                  const {x,y,height,width } = item;
                  this.pillarRectData.push({x,y,height,width});

                })
                this.drawRectOFPillars()
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
               this.layoutData=layoutArray[0].layoutBorder
               layoutArray[0].pillarsData.forEach((item:any)=>{
                const {x,y,height,width } = item;
                this.pillarRectData.push({x,y,height,width});

              })
              this.drawRectOFPillars()
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
  roomsDataObject: RoomData = roomsData;
  workstation4x2:any;
  rooms2x2:any
  rooms2x3:any
  remainRoom:any
  rooms3x2:any
  tempWorkstation4x2:any;
  tempRooms2x2:any
  tempRooms2x3:any
  tempRemainRoom:any
  tempRooms3x2:any
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
           this.workstation4x2 = this.roomDetails.filter(room => room.title === 'Workstation4x2');
           let tempworkstartion=this.workstation4x2
           this.tempWorkstation4x2=tempworkstartion
            this.rooms2x2= this.roomDetails.filter(room => room.dimensions.width === 2 && room.dimensions.height===2);
            this.tempRooms2x2=this.rooms2x2
            this.rooms2x3= this.roomDetails.filter(room => room.dimensions.width === 2 && room.dimensions.height===3);
            this.tempRooms2x3=this.rooms2x3
            // this.rooms2x2.sort((a:any,b:any)=>a.dimensions.height-b.dimensions.height)
            this.remainRoom = this.roomDetails.filter(room => room.dimensions.width >= 3 && room.dimensions.height>=3);
            this.tempRemainRoom=this.remainRoom
            this.rooms3x2= this.roomDetails.filter(room => room.dimensions.width === 3 && room.dimensions.height===2);
            this.tempRooms3x2=this.rooms3x2
          }
        }
      }
      // console.log(this.roomDetails,"HIII")
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
        let entryPoint = 'down';
        entryPoint = 'right';

        let roomCanBeUsed: any[] = [];
        let creatTotalOfRoom = 0;

        for (let point of this.layoutData) {
            if (!point.isFull) {
                if (!this.stage || !this.layer) return;

                if (this.drawingEnabled === true) {
                    roomCanBeUsed.push(point);
                    creatTotalOfRoom++;

                    if (creatTotalOfRoom >= this.displayTotal) {
                        break;
                    }
                }
            } else {
                let rect = new Konva.Rect({
                    x: point.startX,
                    y: point.startY,
                    width: point.rectWidth,
                    height: point.rectHeight,
                    fill: 'white',
                });
                this.layer.add(rect);
            }
        }

        roomCanBeUsed.forEach((point) => {
            const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
            const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
            if (point.entryPoint == 'down') {
                point.endY -= seatHeight;
                this.setUpRoom(point, point.entryPoint);
            } else if (point.entryPoint == 'right') {
                point.endX -= seatWidth;
                this.setUpRoom(point, point.entryPoint);
            } else if (point.entryPoint == 'up') {
                // point.startX+=seatWidth
                this.setUpRoom(point, point.entryPoint);
            } else if (point.entryPoint == 'left') {
                point.startX += seatWidth;
                this.setUpRoom(point, point.entryPoint);
            }
        });
    }
      tempRoomStore:any=null
     setUpRoom(point: any, entryPoint: any) {
if(this.shuffle==true){
  this.workstation4x2=this.tempWorkstation4x2
  this.rooms2x2=this.tempRooms2x2
 this.rooms2x3=this.tempRooms2x3
 this.remainRoom=this.tempRemainRoom
  this.rooms3x2=this.tempRooms3x2
  console.log(this.workstation4x2[0].selectedCount,this.tempWorkstation4x2[0].selectedCount)
}
    let startX = point.startX;
    let startY = point.startY;
    let endX = point.endX;
    let endY = point.endY;
    let roomColumnSwitch = 0;
    let workstationColumnSwitch = 0;
    let workstationRowSwitch = 0;

    const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
    const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;

    // Check if startX is greater than point.startX

        const drawRoom2x2 = () => {
          if (this.rooms2x2.length > 0) {
              if (this.rooms2x2.length > 2) {
                  let halfRoomSize = Math.ceil(this.rooms2x2.length / 2); // Fix to calculate halfRoomSize correctly

                  // Split the array into chunks of size halfRoomSize
                  const roomChunks = [];
                  for (let i = 0; i < this.rooms2x2.length; i += halfRoomSize) {
                      roomChunks.push(this.rooms2x2.slice(i, i + halfRoomSize));
                  }

                  // Draw rooms for each chunk
                  for (const chunk of roomChunks) {
                    this.layer.draw()
                    // debugger
                      drawRooms(chunk);

                  }
              } else {
                this.layer.draw()
                // debugger
                  // Draw rooms normally if the length is 4 or less
                  drawRooms(this.rooms2x2);
              }
          }
      };

      const drawRooms = (rooms:any) => {
        for (const room2x2 of rooms) {
          let roomToDraw = room2x2.selectedCount;
          let roomWidth = room2x2.dimensions.width * seatWidth;
          let roomHeight = room2x2.dimensions.height * seatHeight;
        //   if (this.drawnRooms.includes(room2x2)) {
        //     continue;
        // }
          for (let i = 0; i < roomToDraw; i++) {
            if (startX > point.endX) {
              // Move to the next point
              return;
          }
              // Check for pillar collisions
              for (const pillar of this.pillarRectData) {
                  if (
                      startX + 1 < pillar.x + pillar.width &&
                      startX + roomWidth > pillar.x + 2 &&
                      startY + 1 < pillar.y + pillar.height &&
                      startY + roomHeight > pillar.y + 1
                  ) {
                      // Adjust startY to avoid pillars
                      startY = pillar.y + pillar.height;

                      // Handle room placement when reaching the endY
                      if (startY >= point.endY - 1) {
                          startY = point.startY;
                          roomColumnSwitch++;

                          // Adjust startX for the next column
                          if (roomColumnSwitch % 2 === 0) {
                              startX += roomWidth;
                          } else {
                              startX += roomWidth + seatWidth;
                          }
                      }
                  }
              }
              if (startY + roomHeight > point.endY +1) {
                startY = point.startY;
                roomColumnSwitch++;

                // Adjust startX for the next column
                if (roomColumnSwitch % 2 === 0) {
                    startX += roomWidth;
                } else {
                    startX += roomWidth + seatWidth;
                }


            }
            room2x2.selectedCount--
              // Draw the room
              this.drawRoomRectangle(
                  startX,
                  startY,
                  roomWidth,
                  roomHeight,
                  room2x2.color,
                  room2x2.title
              );


              // Update coordinates for the next iteration
              startY += roomHeight;

              // Handle room placement when reaching the endY

          }
           // After successfully drawing the room, add it to the drawnRooms array
        // this.drawnRooms.push(room2x2);
      }


      };



        const drawWorkstation4x2 = () => {

          let workstationToDraw =0
            if (this.workstation4x2.length > 0) {

                for (const workstationRoom of this.workstation4x2) {
                 workstationToDraw= workstationRoom.selectedCount;
              //    if (this.drawnRooms.includes(workstationRoom)) {
              //     continue;
              // }
                    for (let i = 0; i < workstationToDraw; i++) {
                      if (startX > point.endX) {
                        // Move to the next point
                        return;
                    }
                        // Check for pillar collisions
                        for (const pillar of this.pillarRectData) {
                            if (
                                startX + 1 < pillar.x + pillar.width &&
                                startX + seatWidth > pillar.x + 2 &&
                                startY + 1 < pillar.y + pillar.height &&
                                startY + seatHeight > pillar.y + 1
                            ) {
                                // Adjust startY to avoid pillars
                                startY = pillar.y + pillar.height;

                                // Handle workstation placement when reaching the endY
                                if (startY >= point.endY - 1) {
                                    startY = point.startY;
                                    roomColumnSwitch++;

                                    // Adjust startX for the next column
                                    if (roomColumnSwitch % 2 === 0) {

                                        startX += seatWidth+seatWidth ;
                                    } else {
                                    //  if(roomColumnSwitch<1){
                                    //   startX += seatWidth + seatWidth+seatWidth ;
                                    //   roomColumnSwitch+2
                                    //  }else{
                                      startX += seatWidth + seatWidth +seatWidth;
                                    //  }

                                    }
                                }
                            }
                        }
                        workstationRoom.selectedCount--
                        // Draw the workstation
                        this.drawRoomRectangle(
                            startX,
                            startY,
                            seatWidth,
                            seatHeight,
                            workstationRoom.color,
                            workstationRoom.title
                        );
                        workstationRowSwitch++
                        // Update coordinates for the next iteration
                        if(workstationRowSwitch<2){
                          startX+=seatWidth

                        }else{
                          startX-=seatWidth
                          startY += seatHeight;
                          workstationRowSwitch=0
                        }


                        // Handle workstation placement when reaching the endY
                        if (startY  > point.endY - 1) {
                            startY = point.startY;
                            roomColumnSwitch++;

                            // Adjust startX for the next column
                            if (roomColumnSwitch % 2 === 0) {

                              startX += seatWidth+seatWidth ;
                          } else {
                          //  if(roomColumnSwitch<1){
                            startX += seatWidth + seatWidth+seatWidth ;
                            // roomColumnSwitch+2
                          //  }
                          //  else{
                          //   startX += seatWidth + seatWidth ;
                          //  }

                          }
                        }
                    }
                    // this.drawnRooms.push(workstationRoom);
                }
            }
             // Clear the content of the workstation4x2 array
        // this.workstation4x2 = [];
        };
        const drawRoom2x3 = () => {
          if (this.rooms2x3.length > 0) {
              for (const room2x3 of this.rooms2x3) {
                  let roomToDraw = room2x3.selectedCount;
                  let roomWidth = room2x3.dimensions.width * seatWidth;
                  let roomHeight = room2x3.dimensions.height * seatHeight;
                //   if (this.drawnRooms.includes(room2x3)) {
                //     continue;
                // }
                  for (let i = 0; i < roomToDraw; i++) {
                    if (startX > point.endX) {
                      // Move to the next point
                      return;
                  }
                      // Check for pillar collisions
                      for (const pillar of this.pillarRectData) {
                        if (
                          startX + 1 < pillar.x + pillar.width &&
                          startX + roomWidth > pillar.x + 2 &&
                          startY + 1 < pillar.y + pillar.height &&
                          startY + roomHeight > pillar.y + 1
                      ) {
                              // Adjust startY to avoid pillars
                              startY = pillar.y + pillar.height;

                              // Handle room placement when reaching the endY
                              if (startY >= point.endY +1) {
                                  startY = point.startY;
                                  roomColumnSwitch++;

                                  // Adjust startX for the next column
                                  if (roomColumnSwitch % 2 === 0) {
                                      startX += roomWidth;
                                  } else {
                                      startX += roomWidth + seatWidth;
                                  }
                              }
                          }
                      }
                      if (startY + roomHeight > point.endY +1) {
                        // this.layer.draw()
                        // debugger
                          startY = point.startY;
                          roomColumnSwitch++;

                          // Adjust startX for the next column
                          if (roomColumnSwitch % 2 === 0) {
                              startX += roomWidth;
                          } else {
                              startX += roomWidth + seatWidth;
                          }


                      }
                      // Draw the room
                      room2x3.selectedCount--
                      this.drawRoomRectangle(
                          startX,
                          startY,
                          roomWidth,
                          roomHeight,
                          room2x3.color,
                          room2x3.title
                      );


                      // Update coordinates for the next iteration
                      startY += roomHeight;

                      // Handle room placement when reaching the endY

                  }
                  // this.drawnRooms.push(room2x3);
              }
          }
        };
        const drawRoom3x2 = () => {
          if (this.rooms3x2.length > 0) {
              for (const room2x3 of this.rooms3x2) {
              //   if (this.drawnRooms.includes(room2x3)) {
              //     continue;
              // }
                  let roomToDraw = room2x3.selectedCount;
                  let roomWidth = room2x3.dimensions.width * seatWidth;
                  let roomHeight = room2x3.dimensions.height * seatHeight;

                  for (let i = 0; i < roomToDraw; i++) {
                    if (startX > point.endX) {
                      // Move to the next point
                      return;
                  }
                      // Check for pillar collisions
                      for (const pillar of this.pillarRectData) {
                        if (
                          startX + 1 < pillar.x + pillar.width &&
                          startX + roomWidth > pillar.x + 2 &&
                          startY + 1 < pillar.y + pillar.height &&
                          startY + roomHeight > pillar.y + 1
                      ) {
                              // Adjust startY to avoid pillars
                              startY = pillar.y + pillar.height;

                              // Handle room placement when reaching the endY
                              if (startY >= point.endY +1) {
                                  startY = point.startY;
                                  roomColumnSwitch++;

                                  // Adjust startX for the next column
                                  if (roomColumnSwitch % 2 === 0) {
                                      startX += roomWidth;
                                  } else {
                                      startX += roomWidth + seatWidth;
                                  }
                              }
                          }
                      }
                      if (startY + roomHeight > point.endY +1) {
                        // this.layer.draw()
                        // debugger
                          startY = point.startY;
                          roomColumnSwitch++;

                          // Adjust startX for the next column
                          if (roomColumnSwitch % 2 === 0) {
                              startX += roomWidth;
                          } else {
                              startX += roomWidth + seatWidth;
                          }


                      }
                      room2x3.selectedCount--
                      // Draw the room
                      this.drawRoomRectangle(
                          startX,
                          startY,
                          roomWidth,
                          roomHeight,
                          room2x3.color,
                          room2x3.title
                      );


                      // Update coordinates for the next iteration
                      startY += roomHeight;

                      // Handle room placement when reaching the endY

                  }
                  // this.drawnRooms.push(room2x3);
              }
          }
        };
     // Helper function to draw remaining rooms
     const drawRemainingRooms = () => {
      this.remainRoom.sort((a:any,b:any)=>a.dimensions.width-b.dimensions.width)
      for (const rooms of this.remainRoom) {
          let roomToDraw = rooms.selectedCount;
          let roomWidth = rooms.dimensions.width * seatWidth;
          let roomHeight = rooms.dimensions.height * seatHeight;
        //   if (this.drawnRooms.includes(rooms)) {
        //     continue;
        // }
          for (let i = 0; i < roomToDraw; i++) {
            if (startX > point.endX) {
              // Move to the next point
              return;
          }
              // Check for pillar collisions
              for (const pillar of this.pillarRectData) {
                if (
                  startX + 1 < pillar.x + pillar.width &&
                  startX + roomWidth > pillar.x + 2 &&
                  startY + 1 < pillar.y + pillar.height &&
                  startY + roomHeight > pillar.y + 1
              ) {
                      // Adjust startY to avoid pillars
                      startY = pillar.y + pillar.height;

                      // Handle room placement when reaching the endY
                      if (startY >= point.endY +1) {
                          startY = point.startY;
                          roomColumnSwitch++;

                          // Adjust startX for the next column
                          if (roomColumnSwitch % 2 === 0) {
                              startX += roomWidth;
                          } else {
                              startX += roomWidth + seatWidth;
                          }
                      }
                  }
              }
  // Handle room placement when reaching the endY
  if (startY + roomHeight > point.endY - 1) {
    startY = point.startY;
    roomColumnSwitch++;

    // Adjust startX for the next column
    if (roomColumnSwitch % 2 === 0) {
        startX += roomWidth;
    } else {
        startX += roomWidth + seatWidth;
    }
} rooms.selectedCount--
              // Draw the remaining room
              this.drawRoomRectangle(
                  startX,
                  startY,
                  roomWidth,
                  roomHeight,
                  rooms.color,
                  rooms.title
              );

              // Update coordinates for the next iteration
              startY += roomHeight;


          }
          // this.drawnRooms.push(rooms);
      }
  };

  const functionsArray = [drawWorkstation4x2,drawRoom2x2,drawRoom2x3,drawRoom3x2,drawRemainingRooms];

  // Function to shuffle the array
  const shuffleArray=(array:any)=> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle the array
  shuffleArray(functionsArray);

  // Call each function in the shuffled order
  // console.log(functionsArray)
  functionsArray.forEach((func:any )=> func());

};




      //draws  the room
      drawRoomRectangle(x: number, y: number, width: number, height: number, fill: string, title: string) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: fill,
          opacity: 0.3,
          stroke: 'black',
          strokeWidth: 0.5,
          id: 'rect1',
          name: `room-rectangle-${title}`,
          draggable: true,
        });


          this.layer.add(rect);

          if (title !== 'Workstation4x2' && title !== 'Workstation3x2' && title !== 'Workstation5x2') {
            let titleOfRoom = new Konva.Text({
              x: x,
              y: y,
              height: height,
              text: `${title}`,
              fontSize: 6,
              width: width,
              align: 'center',
              verticalAlign: 'middle',
              fontFamily: 'Courier New',
              id:'titles',
              name: 'room-names',
              wrap: `${title}`,
            });

            this.layer.add(titleOfRoom);
          }
        this.layer.batchDraw();
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
    layerForPillar!:Konva.Layer;
pillarRectData:any[]=[]


drawRectOFPillars(){
  this.layerForPillar=new Konva.Layer()
  this.stage.add(this.layerForPillar)
  this.pillarRectData.forEach(pilar=>{
    let rect=new Konva.Rect({
      x:pilar.x,
      y:pilar.y,
      width:pilar.width,
      height:pilar.height,
      fill:'transparent',
      stroke:'black',
      strokeWidth:0.5,
      draggable:true
    })
    this.layerForPillar.add(rect)
  })

  this.layerForPillar.batchDraw()
}
shuffle:boolean=false;
redrawTheRoom(){
  this.shuffle=!this.shuffle

var childToRemove = this.layer.find('#rect1');
var childToRemove2 = this.layer.find('#titles');
if (childToRemove) {
  childToRemove.forEach(room=>{
    room.destroy()
  })
  childToRemove2.forEach(room=>{
    room.destroy()
  })
  // childToRemove.remove();
  this.layer.draw(); // Redraw the layer after removing the child
}
  // this.layer.removeChildren()
  this.drawRoomsInRectangle()

}

}
