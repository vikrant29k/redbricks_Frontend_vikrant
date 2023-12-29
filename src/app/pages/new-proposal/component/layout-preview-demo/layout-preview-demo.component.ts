// Almost working code for drawing rooms
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from "src/environments/environment";
import * as roomsData from '../../../location/component/layout-editor/seat-draw/roomCountsData.json'
import { ViewLayoutPreviewComponent } from "./view-layout-preview/view-layout-preview.component";
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
  selector: 'app-layout-preview-demo',
  templateUrl: './layout-preview-demo.component.html',
  styleUrls: ['./layout-preview-demo.component.scss']
})
export class LayoutPreviewDemoComponent implements OnInit {
  loading = true;
  id!: string;
  imageUrl:any;
  customWidth = 1080;
  customHeight = 734;
  getAllPoints:any[]=[]
  totalNumber!:number;
seatWidth!: number;
seatHeight!: number;
content:any;
pillarRectData:any[]=[];
layoutData:any[]=[];
drawnRooms: any[] = [];
displayTotal!:number;
tempRoomStore:any=null
shuffle:boolean=false;
expandedContainer: number | null = null;
currentShape:any
openOneTime:number=0
//read the content
roomDetails:any[]=[]
sepratedContent:any[]=[]
roomsDataObject: RoomData = roomsData;
workstation4x2:any;
regularCabin:any;
meetingRoom4P:any;
largeCabin:any;
collabRoom4P:any
collabRoom6P:any
collabRoom8P:any
remainRoom:any
meeting6P:any
meeting8P:any;
meeting10P:any;
meeting12P:any;
meeting16P:any;
cabinMD:any;
boardRoom20P:any;
boardRoom24P:any;
cubical:any;
server1rack:any;
server2rack:any;
server3rack:any;
server4rack:any;
seprateRooms1:any;
seprateRooms2:any;
receptionSmall:any;
receptionLarge:any
receptionMedium:any
activeContainer = 1;

constructor(
  public dialogRef: MatDialogRef<LayoutPreviewDemoComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private proposalService: ProposalService,
  private dialog:MatDialog,
  private locationService:LocationService
) { }

switchContainer(direction: 'left' | 'right'): void {
  if (direction === 'left') {
    this.activeContainer = Math.max(1, this.activeContainer - 1);
  } else {
    this.activeContainer = Math.min(6, this.activeContainer + 1);
  }
}
  ngOnInit(): void {
      this.totalNumber=this.data.totalNoOfSeat;
      this.displayTotal=this.totalNumber;
      this.content=this.data.content;
      this.proposalService.generateLayout(this.data.proposalId).subscribe((res:any)=>{
        this.getImageAndInitialize(res.locationId, res.layoutArray, 'container1');
        this.getImageAndInitialize(res.locationId, res.layoutArray, 'container2');
        this.getImageAndInitialize(res.locationId, res.layoutArray, 'container3');
        this.getImageAndInitialize(res.locationId, res.layoutArray, 'container4');
      })

  }

    initializeKonva(imageObj: HTMLImageElement, containerId: string): void {
      const stage = new Konva.Stage({
        container: containerId,
        width: this.customWidth,
        height: this.customHeight,
      });

      const menuNode = document.getElementById('menu');
      document.getElementById('view-button')?.addEventListener('click', () => {
        if(this.currentShape){

          if(this.openOneTime==0){
            const dialogRef = this.dialog.open(ViewLayoutPreviewComponent, {
              width: '1500px',
              height: '800px',
              data: { currentShape:this.currentShape,proposalId:this.data.proposalId,content:this.content,totalNumber:this.totalNumber },
            })
            dialogRef.afterClosed().subscribe(()=>{this.openOneTime=0})
            this.openOneTime++
          }
          }
      });
      document.getElementById('save-button')?.addEventListener('click', () => {
        if(this.currentShape){
          console.log(this.currentShape)
        }
      });
      window.addEventListener('click', () => {
        // hide menu
        if (menuNode) {
          menuNode.style.display = 'none';
        }
      });
      stage.on('contextmenu', (e)=> {
        e.evt.preventDefault();
        if (e.target === stage) {
          return;
        }
        if(this.currentShape){
          this.currentShape=null
        }
        this.currentShape = e.currentTarget as Konva.Stage;
        // show menu
        if (menuNode) {
          menuNode.style.display = 'initial';
          const pointerPosition = stage.getPointerPosition();
          if (pointerPosition) {
            const containerRect = stage.container().getBoundingClientRect();
            menuNode.style.top = containerRect.top + pointerPosition.y + 4 + 'px';
            menuNode.style.left = containerRect.left + pointerPosition.x + 4 + 'px';
            menuNode.style.zIndex = '9999';
          }
        }
      });

      const layer = new Konva.Layer({
        name: 'firstLayer',
      });

      stage.add(layer);
      const backgroundImage = new Konva.Image({
        image: imageObj,
        width: this.customWidth,
        height: this.customHeight,
      });

      layer.add(backgroundImage);
      layer.draw();
      this.toggleContainerSize(containerId, stage);
      this.drawRectOFPillars(layer);
      this.drawRoomsInRectangle(layer);
    }

//intialize the image and stage and layer

    getImageAndInitialize(locationId:any,layoutArray:any,containerId: string){
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

              this.seprateData();
              this.layoutData=layoutArray[0].layoutBorder
              layoutArray[0].pillarsData.forEach((item:any)=>{
                const {x,y,height,width } = item;
                this.pillarRectData.push({x,y,height,width});

              })
               this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
              this.initializeKonva(imageObj,containerId);


              this.loading = false;
            };
            imageObj.src = this.imageUrl;
            imageObj.crossOrigin = 'Anonymous';
                }else{
            const imageObj = new Image();
            imageObj.onload = () => {


             this.layoutData=layoutArray[0].layoutBorder
             layoutArray[0].pillarsData.forEach((item:any)=>{
              const {x,y,height,width } = item;
              this.pillarRectData.push({x,y,height,width});

            })
            this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
            this.seprateData();
            this.initializeKonva(imageObj,containerId);
            // this.drawRectOFPillars()
              // this.drawRoomsInRectangle()
              this.loading = false;
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

          }
        }
      }
      this.roomDetails.sort((a, b) => a.priority - b.priority);
          this.workstation4x2 = this.roomDetails.filter(room => room.title === 'Workstation4x2' || room.title === 'Phone Booth');
            this.regularCabin= this.roomDetails.filter(room => room.title === 'Regular Cabin');
            this.meetingRoom4P=this.roomDetails.filter(room => room.title === '4P Meeting');
            this.largeCabin= this.roomDetails.filter(room => room.title === 'Large Cabin');
            this.collabRoom4P= this.roomDetails.filter(room => room.title === '4P Collab Area');
            this.collabRoom6P= this.roomDetails.filter(room => room.title === '6P Collab Area');
            this.collabRoom8P= this.roomDetails.filter(room => room.title === '8P Collab Area');
            this.cabinMD= this.roomDetails.filter(room => room.title === 'MD Cabin');
            // this.regularCabin.sort((a:any,b:any)=>a.dimensions.height-b.dimensions.height)
            this.remainRoom = this.roomDetails.filter(room => room.dimensions.width >= 3 && room.dimensions.height>=3);
            this.meeting6P= this.roomDetails.filter(room =>room.title === '6P Meeting');
            this.meeting8P= this.roomDetails.filter(room =>room.title === '8P Meeting');
            this.meeting10P= this.roomDetails.filter(room =>room.title === '10P Meeting');
            this.meeting12P= this.roomDetails.filter(room =>room.title === '12P Meeting');
            this.meeting16P= this.roomDetails.filter(room =>room.title === '16P Meeting');
            this.boardRoom20P=this.roomDetails.filter(room=>room.title==='20P Board Room');
            this.boardRoom24P=this.roomDetails.filter(room=>room.title==='24P Board Room');
            this.cubical = this.roomDetails.filter(room=> room.title==='Cubical');
            this.server1rack = this.roomDetails.filter(room=> room.title==='1 Rack Server');
            this.server2rack = this.roomDetails.filter(room=> room.title==='2 Rack Server');
            this.server3rack = this.roomDetails.filter(room=> room.title==='3 Rack Server');
            this.server4rack = this.roomDetails.filter(room=> room.title==='4 Rack Server');
            this.receptionSmall = this.roomDetails.filter(room=> room.title==='Small Reception');
            this.receptionLarge = this.roomDetails.filter(room=> room.title==='Large Reception');
            this.receptionMedium = this.roomDetails.filter(room=> room.title==='Medium Reception');
            this.seprateRooms1 = this.roomDetails.filter(room=> room.title==='Store Room' || room.title==='Dry Pantry Room' || room.title==='Prayer/Pooja Room' || room.title==='Wellness Room');
            this.seprateRooms2 = this.roomDetails.filter(room=> room.title==='Cafeteria' || room.title==='Training Room' || room.title==='Game Room');
      // console.log(this.roomDetails,"HIII")
      }


    drawRoomsInRectangle(layer:Konva.Layer) {
      let roomCanBeUsed: any[] = [];
      let creatTotalOfRoom = 0;
      for (let point of this.layoutData) {
          if (!point.isFull) {
              if (!layer) return;
                  roomCanBeUsed.push(point);
                  creatTotalOfRoom++;
                  if (creatTotalOfRoom >= this.displayTotal) {
                      break;
                  }
          } else {
              let rect = new Konva.Rect({
                  x: point.startX,
                  y: point.startY,
                  width: point.rectWidth,
                  height: point.rectHeight,
                  fill: 'white',
              });
              layer.add(rect);
          }
      }

      roomCanBeUsed.forEach((point) => {
          const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
          const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
          if (point.entryPoint == 'down') {
              point.endY -= seatHeight;
              this.setUpRoom(point, point.entryPoint,layer);
          } else if (point.entryPoint == 'right') {
              point.endX -= seatWidth;
              this.setUpRoom(point, point.entryPoint,layer);
          } else if (point.entryPoint == 'up') {
              // point.startX+=seatWidth
              this.setUpRoom(point, point.entryPoint,layer);
          } else if (point.entryPoint == 'left') {
              point.startX += seatWidth;
              this.setUpRoom(point, point.entryPoint,layer);
          }
      });
    }

   setUpRoom(point: any, entryPoint: any,layer:any) {
  let startX = point.startX;
  let startY = point.startY;
  let endX = point.endX;
  let endY = point.endY;

  let workstationRowSwitch = 0;
  let roomColumnSwitch=0
  const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
  const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
   let maxRoomWidthInColumn = 0;  // Track the maximum room width in the current column
   const drawRoom = (roomType: any) => {

    for (const room of roomType) {
      let roomToDraw = room.selectedCount;
      let roomWidth = room.dimensions.width * seatWidth;
      let roomHeight = room.dimensions.height * seatHeight;
      if (roomWidth > maxRoomWidthInColumn) {

        maxRoomWidthInColumn = roomWidth;
        // debugger\.
      }
      if(room.title!='Workstation4x2' && room.title!='Phone Booth'){
      for (let i = 0; i < roomToDraw; i++) {
        if (startX > point.endX) {
          // Move to the next point
          return;
        }
        // Check for pillar collisions
                // if(room.dimensions.width<=3 && room.dimensions.height<=3){
                  debugger
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
              // if (startY >= point.endY + 1) {
              //   startY = point.startY;
              //   roomColumnSwitch++;

              //   // Adjust startX for the next column
              //   if (roomColumnSwitch % 2 === 0) {
              //     startX += maxRoomWidthInColumn;
              //   } else {
              //     this.drawRoomRectangle(
              //       startX+maxRoomWidthInColumn,
              //       point.startY,  // Start from the beginning of the designated space
              //       seatWidth,
              //       point.endY - point.startY,  // Height spans from startY to endY
              //       'green',  // Color of the passage
              //       'Passage',  // Title or identifier for the passage
              //       layer
              //     );

              //     startX += maxRoomWidthInColumn + seatWidth;
              //   }
              //   // maxRoomWidthInColumn=0
              // }
            }
          }
        // }

        // Handle room placement when reaching the endY
        if (startY+roomHeight >=point.endY+1) {

          startY = point.startY;
          roomColumnSwitch++;
          // layer.draw()
          // debugger
          //   maxRoomWidthInColumn = room.dimensions.width * seatWidth;

          // Adjust startX for the next column
          if (roomColumnSwitch % 2 === 0) {
            startX += maxRoomWidthInColumn;
          } else {
            this.drawRoomRectangle(
              startX+maxRoomWidthInColumn,
              point.startY,  // Start from the beginning of the designated space
              seatWidth,
              point.endY - point.startY,  // Height spans from startY to endY
              'green',  // Color of the passage
              'Passage',  // Title or identifier for the passage
              layer
            );

            startX += maxRoomWidthInColumn + seatWidth;
          }
          // maxRoomWidthInColumn = 0;
        }

        room.selectedCount--;
        // Draw the room
        this.drawRoomRectangle(
          startX,
          startY,
          roomWidth,
          roomHeight,
          room.color,
          room.title,layer
        );

        // Update coordinates for the next iteration
        startY += roomHeight;
      }
    }else{
      let workstationSwitch=0
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
                       // Handle workstation placement when reaching the endY
                      //  if (startY >= point.endY - 1) {
                      //      startY = point.startY;
                      //     //  workstationSwitch++;
                      //      // Adjust startX for the next column
                      //      if (workstationSwitch % 2 === 0) {
                      //          startX += seatWidth+seatWidth +seatWidth ;
                      //      } else {
                      //        startX +=  seatWidth+seatWidth ;
                      //      }
                      //     //  seatWidth=0
                      //  }
                   }
               }
                 // Handle workstation placement when reaching the endY
               if (startY  > point.endY - 1) {
                   startY = point.startY;
                   workstationSwitch++;
                   if (workstationSwitch % 2 === 0) {
                    this.drawRoomRectangle(
                      startX+maxRoomWidthInColumn,
                      point.startY,  // Start from the beginning of the designated space
                      seatWidth,
                      point.endY - point.startY,  // Height spans from startY to endY
                      'green',  // Color of the passage
                      'Passage',  // Title or identifier for the passage
                      layer
                    );
                     startX += seatWidth+seatWidth+maxRoomWidthInColumn  ;
                 } else {
                 //  if(roomColumnSwitch<1){

                   startX += seatWidth+seatWidth ;
                 }
                //  maxRoomWidthInColumn=0
               }
               room.selectedCount--
               // Draw the workstation
               this.drawRoomRectangle(
                   startX,
                   startY,
                   roomWidth,
                   roomHeight,
                   room.color,
                   room.title,layer
               );
               workstationRowSwitch++
               // Update coordinates for the next iteration
               if(workstationRowSwitch<2){
                 startX+=roomWidth

               }else{
                 startX-=roomWidth
                 startY += roomHeight;
                 workstationRowSwitch=0
               }


           }

    }
  }
  };



  const functionsArray = [
    () => drawRoom(this.workstation4x2),  () => drawRoom(this.collabRoom4P),() => drawRoom(this.collabRoom6P), () => drawRoom(this.collabRoom8P),
    () => drawRoom(this.regularCabin), () => drawRoom(this.meetingRoom4P),() => drawRoom(this.largeCabin),() => drawRoom(this.meeting6P),
    () => drawRoom(this.meeting8P),() => drawRoom(this.meeting10P),() => drawRoom(this.meeting12P),() => drawRoom(this.meeting16P),
    () => drawRoom(this.cabinMD),() => drawRoom(this.boardRoom20P),() => drawRoom(this.boardRoom24P),() => drawRoom(this.server1rack),
    () => drawRoom(this.server2rack),() => drawRoom(this.server3rack),() => drawRoom(this.server4rack),() => drawRoom(this.cubical),
    () => drawRoom(this.seprateRooms1),() => drawRoom(this.seprateRooms2),() => drawRoom(this.receptionLarge),() => drawRoom(this.receptionSmall),
    () => drawRoom(this.receptionMedium),
  ];
  const shuffleArray=(array:any)=> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  // Shuffle the array
  shuffleArray(functionsArray);

  // Call each function in the shuffled order
  functionsArray.forEach((func) => func());

    };

    //draws  the room
    drawRoomRectangle(x: number, y: number, width: number, height: number, fill: string, title: string, layer:Konva.Layer) {
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


        layer.add(rect);

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

          layer.add(titleOfRoom);
        }
      layer.batchDraw();
    }


    drawRectOFPillars(layer:Konva.Layer){
    this.pillarRectData.forEach(pilar=>{
      let rect=new Konva.Rect({
        x:pilar.x,
        y:pilar.y,
        width:pilar.width,
        height:pilar.height,
        fill:'transparent',
        stroke:'black',
        strokeWidth:0.5,
        // draggable:true
      })
      layer.add(rect)
    })

    layer.batchDraw()
    }

    expandContainer(containerNumber: number): void {
      this.expandedContainer = this.expandedContainer === containerNumber ? null : containerNumber;
    }

    fitStageToContainer(stage: Konva.Stage, containerId: string): void {
      const container = document.getElementById(containerId);
      if (container) {
        const scale = Math.min(
          container.clientWidth / this.customWidth,
          container.clientHeight / this.customHeight
        );

        stage.width(this.customWidth * scale);
        stage.height(this.customHeight * scale);
        stage.scale({ x: scale, y: scale });
        stage.draw();
      }
    }

    toggleContainerSize(containerId: string,stages:Konva.Stage): void {
      const container = document.getElementById(containerId);
      if (container) {
        // container.classList.toggle('expanded');
        const stage = stages; // replace with your actual stage reference
        this.fitStageToContainer(stage, containerId);
      }
    }

}

