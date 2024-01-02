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
stage!:Konva.Stage;
layer!:Konva.Layer;
constructor(
  public dialogRef: MatDialogRef<LayoutPreviewDemoComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private proposalService: ProposalService,
  private dialog:MatDialog,
  private locationService:LocationService
) { }


  ngOnInit(): void {
      this.totalNumber=this.data.totalNoOfSeat;
      this.displayTotal=this.totalNumber;
      this.content=this.data.content;
      this.proposalService.generateLayout(this.data.proposalId).subscribe((res:any)=>{
        this.getImageAndInitialize(res.locationId, res.layoutArray);
        // this.getImageAndInitialize(res.locationId, res.layoutArray, 'container2');
        // this.getImageAndInitialize(res.locationId, res.layoutArray, 'container3');
        // this.getImageAndInitialize(res.locationId, res.layoutArray, 'container4');
      })

  }

    initializeKonva(imageObj: HTMLImageElement): void {
      this.stage = new Konva.Stage({
        container:  'container1',
        width: this.customWidth,
        height: this.customHeight,
      });

      // const menuNode = document.getElementById('menu');
      // document.getElementById('view-button')?.addEventListener('click', () => {
      //   if(this.currentShape){

      //     if(this.openOneTime==0){
      //       const dialogRef = this.dialog.open(ViewLayoutPreviewComponent, {
      //         width: '90vw',
      //         height: '800px',
      //         data: { currentShape:this.currentShape,proposalId:this.data.proposalId, content:this.content,totalNumber:this.totalNumber },
      //       })
      //       dialogRef.afterClosed().subscribe(()=>{this.openOneTime=0})
      //       this.openOneTime++
      //     }
      //     }
      // });
      // document.getElementById('save-button')?.addEventListener('click', () => {
      //   if(this.currentShape){
      //     console.log(this.currentShape)
      //   }
      // });
      // window.addEventListener('click', () => {
      //   // hide menu
      //   if (menuNode) {
      //     menuNode.style.display = 'none';
      //   }
      // });
      // stage.on('contextmenu', (e)=> {
      //   e.evt.preventDefault();
      //   if (e.target === stage) {
      //     return;
      //   }
      //   if(this.currentShape){
      //     this.currentShape=null
      //   }
      //   this.currentShape = e.currentTarget as Konva.Stage;
      //   // show menu
      //   if (menuNode) {
      //     menuNode.style.display = 'initial';
      //     const pointerPosition = stage.getPointerPosition();
      //     if (pointerPosition) {
      //       const containerRect = stage.container().getBoundingClientRect();
      //       menuNode.style.top = containerRect.top + pointerPosition.y + 4 + 'px';
      //       menuNode.style.left = containerRect.left + pointerPosition.x + 4 + 'px';
      //       menuNode.style.zIndex = '9999';
      //     }
      //   }
      // });

      this.layer = new Konva.Layer({
        name: 'firstLayer',
      });

      this.stage.add(this.layer);
      const backgroundImage = new Konva.Image({
        image: imageObj,
        width: this.customWidth,
        height: this.customHeight,
      });

      this.layer.add(backgroundImage);
      this.layer.draw();
      // this.toggleContainerSize(containerId, stage);\
      this.seprateData()
      this.drawRectOFPillars();
      this.drawRoomsInRectangle();
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
            const imageObj = new Image();
            imageObj.onload = () => {

              // this.seprateData();
              this.layoutData=layoutArray[0].layoutBorder
              layoutArray[0].pillarsData.forEach((item:any)=>{
                const {x,y,height,width } = item;
                this.pillarRectData.push({x,y,height,width});

              })
               this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
              this.initializeKonva(imageObj);


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
            // this.seprateData();
            this.initializeKonva(imageObj);
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

      }


    drawRoomsInRectangle() {
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
      let roomCanBeUsed: any[] = [];
      let creatTotalOfRoom = 0;
      for (let point of this.layoutData) {
          if (!point.isFull) {
              if (!this.layer) return;
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
              this.layer.add(rect);
          }
      }

      roomCanBeUsed.forEach((point) => {
          const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
          const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
          if (point.entryPoint == 'down') {

              point.endY -= seatHeight;
              this.setUpRoom(point, point.entryPoint);
          }
          //  else if (point.entryPoint == 'right') {

          //     point.endX -= seatWidth;
          //     this.setUpRoom(point, point.entryPoint,layer);
          // }
          else if (point.entryPoint == 'up') {

              // point.startX+=seatWidth
              this.setUpRoom(point, point.entryPoint);
          } else if (point.entryPoint == 'left') {

              point.startX += seatWidth;
              this.setUpRoom(point, point.entryPoint);
          }
      });
    }


  setUpRoom(point: any, entryPoint: any) {

    let startX = point.startX;
    let startY = point.startY;
    let endX = point.endX;
    let endY = point.endY;
    let lastRoomWidth;
    let workstationRowSwitch = 0;
    let roomColumnSwitch=0
    const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight;
    const seatHeight = point.seatPosition ? this.seatHeight : this.seatWidth;
    let workstationData:any;
    //  let maxRoomWidthInColumn = 0;  // Track the maximum room width in the current column
    const drawRoom = (roomType:any) => {

      for (const room of roomType) {
        if (room.title === "Workstation4x2") {

          workstationData = room;
          debugger;
          continue;
        }
        let roomWidth = seatWidth * room.dimensions.width;
        let roomHeight = seatHeight * room.dimensions.height;

        for (let i = 0; i < room.selectedCount; i++) {
          // checks for the pillar intersection
          for (let pillar of this.pillarRectData) {
            if (
              startX + 1 < pillar.x + pillar.width &&
              startX + roomWidth > pillar.x + 2 &&
              startY + 1 < pillar.y + pillar.height &&
              startY + roomHeight > pillar.y + 1
            ) {
              startY = pillar.y + pillar.height;
            }
          }

          if (startY + roomHeight > endY) {
            startY = point.startY;

            if (roomColumnSwitch % 2 == 0) {
              startX += roomWidth;
              this.drawRoomRectangle(
                startX,
                startY,
                seatWidth,
                endY - startY,
                "green",
                "pillar"

              );
              startX += seatWidth;
              // Draw workstation data if available

              if (workstationData) {
                debugger
                // for (const workstationRoom of workstationData) {
                  let workstationSwitch=0
                  let startingXForWorkStation=startX;
                  for(let j =0;j<workstationData.selectedCount;j++){
                  this.drawRoomRectangle(
                    startX,
                    startY,
                    seatWidth,
                    seatHeight,
                    workstationData.color,
                    workstationData.title

                  );
                  // startY += seatHeight;
                  if(workstationSwitch%2==0){
                    startX+=seatWidth
                   workstationSwitch++
                  }else{
                    startX=startingXForWorkStation
                    startY+=seatHeight
                    workstationSwitch--
                  }
                  if(startY==endY || startY>endY-1){
                    startY=point.startY;
                    startX+=seatWidth
                  }
                }
                // Reset workstation data
                workstationData = undefined;
              }
            } else {
              startX += roomWidth;
            }
            roomColumnSwitch++;
          }

          this.drawRoomRectangle(
            startX,
            startY,
            roomWidth,
            roomHeight,
            room.color,
            room.title

          );
          startY += roomHeight;

        }
        lastRoomWidth=roomWidth
      }


    };


    const functionsArray = [
      { roomType: this.workstation4x2, called: false },
      { roomType: this.collabRoom4P, called: false },
      { roomType: this.cubical, called: false },
      { roomType: this.regularCabin, called: false },
      { roomType: this.meetingRoom4P, called: false },
      { roomType: this.largeCabin, called: false },
      { roomType: this.meeting6P, called: false },
      { roomType: this.collabRoom6P, called: false },
      { roomType: this.collabRoom8P, called: false },
      { roomType: this.meeting10P, called: false },
      { roomType: this.meeting12P, called: false },
      { roomType: this.meeting16P, called: false },
      { roomType: this.cabinMD, called: false },
      { roomType: this.boardRoom20P, called: false },
      { roomType: this.boardRoom24P, called: false },
      { roomType: this.server1rack, called: false },
      { roomType: this.server2rack, called: false },
      { roomType: this.server3rack, called: false },
      { roomType: this.server4rack, called: false },
      { roomType: this.seprateRooms1, called: false },
      { roomType: this.seprateRooms2, called: false },
      { roomType: this.receptionLarge, called: false },
      { roomType: this.receptionSmall, called: false },
      { roomType: this.receptionMedium, called: false },
      { roomType: this.meeting8P, called: false },
    ];

    // Call each function only if the associated object has data and hasn't been called before
    functionsArray.forEach((obj, index) => {
      if (obj.roomType && obj.roomType.length > 0 && !obj.called) {
        functionsArray[index].called = true;
        drawRoom(obj.roomType);

      }
    });
    if(roomColumnSwitch%2==0){
      this.drawRoomRectangle(
        startX+lastRoomWidth,
        point.startY,
        seatWidth,
        endY - point.startY,
        "green",
        "pillar",

      );
    }
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

        // if (title !== 'Workstation4x2' && title !== 'Workstation3x2' && title !== 'Workstation5x2') {
        //   let titleOfRoom = new Konva.Text({
        //     x: x,
        //     y: y,
        //     height: height,
        //     text: `${title}`,
        //     fontSize: 6,
        //     width: width,
        //     align: 'center',
        //     verticalAlign: 'middle',
        //     fontFamily: 'Courier New',
        //     id:'titles',
        //     name: 'room-names',
        //     wrap: `${title}`,
        //   });

        //   this.layer.add(titleOfRoom);
        // }
      this.layer.batchDraw();
    }


    drawRectOFPillars(){
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
      this.layer.add(rect)
    })

    this.layer.batchDraw()
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

    // update the room details in the data
    updateRoomDetails(title:string,count:number) {
      // Find the corresponding item in roomDetails and update its selectedCount
      const index = this.roomDetails.findIndex(item => item.title === title);
      if (index !== -1) {
        this.roomDetails[index].selectedCount = Number(count);
        // this.seprateData()
        let rects = this.layer.find('#rect1');
        rects.forEach(rect=>{
          rect.destroy()
        })
        this.drawRoomsInRectangle()
      }
    }
}
