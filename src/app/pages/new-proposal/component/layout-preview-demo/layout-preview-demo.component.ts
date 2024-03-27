// HIGH RISK TO DELETE//working code full
//18 march Perfect code
import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { LocationService } from 'src/app/service/location/location.service';
import Konva from 'konva';
import { environment } from 'src/environments/environment';
import * as roomsData from '../../../location/component/layout-editor/seat-draw/roomCountsData.json';
export interface RoomData {
  [key: string]: {
    count: number;
    color: string;
    width: number;
    height: number;
    priority: number;
  };
}
export interface DialogData {
  locationId: string;
  proposalId: string;
  totalNoOfSeat: number;
  content: any;
}
@Component({
  selector: 'app-layout-preview-demo',
  templateUrl: './layout-preview-demo.component.html',
  styleUrls: ['./layout-preview-demo.component.scss'],
})
export class LayoutPreviewDemoComponent implements OnInit {
  loading = true;
  id!: string;
  imageUrl: any;
  customWidth = 1080;
  customHeight = 734;
  getAllPoints: any[] = [];
  totalNumber!: number;
  seatWidth!: number;
  seatHeight!: number;
  content: any;
  pillarRectData: any[] = [];
  layoutData: any[] = [];
  drawnRooms: any[] = [];
  displayTotal!: number;
  tempRoomStore: any = null;
  shuffle: boolean = false;
  expandedContainer: number | null = null;
  currentShape: any;
  openOneTime: number = 0;
  //read the content
  roomDetails: any[] = [];
  sepratedContent: any[] = [];
  roomsDataObject: RoomData = roomsData;
  workstation4x2: any;
  regularCabin: any;
  meetingRoom4P: any;
  largeCabin: any;
  collabRoom4P: any;
  collabRoom6P: any;
  collabRoom8P: any;
  remainRoom: any;
  meeting6P: any;
  meeting8P: any;
  meeting10P: any;
  meeting12P: any;
  meeting16P: any;
  cabinMD: any;
  boardRoom20P: any;
  boardRoom24P: any;
  cubical: any;
  server1rack: any;
  server2rack: any;
  server3rack: any;
  server4rack: any;
  seprateRooms1: any;
  seprateRooms2: any;
  receptionSmall: any;
  receptionLarge: any;
  receptionMedium: any;
  activeContainer = 1;
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  constructor(
    public dialogRef: MatDialogRef<LayoutPreviewDemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private proposalService: ProposalService,
    private dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.totalNumber = this.data.totalNoOfSeat;
    this.displayTotal = this.totalNumber;
    this.content = this.data.content;
    this.proposalService
      .generateLayout(this.data.proposalId)
      .subscribe((res: any) => {
        this.getImageAndInitialize(res.locationId, res.layoutArray);
      });
  }

  initializeKonva(imageObj: HTMLImageElement): void {
    this.stage = new Konva.Stage({
      container: 'container1',
      width: this.customWidth,
      height: this.customHeight,
    });

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
    this.enableZoom();
    this.stage.on('dblclick', () => {
      this.resetZoomAndPosition();
    });
    this.separateData();
  }

  //intialize the image and stage and layer

  getImageAndInitialize(locationId: any, layoutArray: any) {
    this.seatWidth = layoutArray[0].seatWidth;
    this.seatHeight = layoutArray[0].seatHeight;
    this.locationService.getImageById(locationId).subscribe((imageUrl) => {
      this.imageUrl = environment.baseUrl + 'images/' + imageUrl;
      this.proposalService.getProposalByLocationId(locationId).subscribe(
        (result: any) => {
          if (result.Message == 'No Data') {
            const imageObj = new Image();
            imageObj.onload = () => {
              // this.seprateData();
              this.layoutData = layoutArray[0].layoutBorder;
              layoutArray[0].pillarsData.forEach((item: any) => {
                const { x, y, height, width } = item;
                this.pillarRectData.push({ x, y, height, width });

              });
              this.layoutData.sort(
                (a: any, b: any) => a.sequenceNo - b.sequenceNo
              );
              this.initializeKonva(imageObj);

              this.loading = false;
            };
            imageObj.src = this.imageUrl;
            imageObj.crossOrigin = 'Anonymous';
          } else {
            const imageObj = new Image();
            imageObj.onload = () => {
              this.layoutData = layoutArray[0].layoutBorder;
              layoutArray[0].pillarsData.forEach((item: any) => {
                const { x, y, height, width } = item;
                this.pillarRectData.push({ x, y, height, width });
              });
              this.layoutData.sort(
                (a: any, b: any) => a.sequenceNo - b.sequenceNo
              );

              this.initializeKonva(imageObj);

              this.loading = false;
            };
            imageObj.src = this.imageUrl;
            imageObj.crossOrigin = 'Anonymous'; // cors error if removed
          }
        },
        (error) => {
          console.error('Error loading image data:', error);
        }
      );
    });
  }

  separatedContent: any[] = [];

  separateData() {
    const contentArray = this.content.split(',');
    contentArray.forEach((item: any) => {
      const keyValue = item.trim().split('=');
      if (keyValue.length === 2) {
        const key = keyValue[0].trim();
        const value = parseInt(keyValue[1].trim());
        this.separatedContent[key] = value;
      }
    });

    for (const key in this.separatedContent) {
      if (this.separatedContent.hasOwnProperty(key)) {
        if (this.roomsDataObject[key]) {
          let count = this.separatedContent[key];
          const jsonData = this.roomsDataObject[key];
          let widthMultiplier = 1; // Default multiplier
          if (key === 'Workstation4x2') {
            if (count > 72 && count < 150) {
              count = count / 3;
              widthMultiplier = 3;
            } else if (count > 150) {
              count = count / 4;
              widthMultiplier = 4;
            } else {
              count = count / 2;
              widthMultiplier = 2;
            }
          }
          const commonObject = {
            title: key,
            count: jsonData.count,
            selectedCount: count,
            dimensions: {
              width: jsonData.width * widthMultiplier * this.seatWidth,
              height: jsonData.height * this.seatHeight,
            },
            color: jsonData.color,
            drawn: false,
            priority: jsonData.priority,
          };
          this.roomDetails.push(commonObject);
        }
      }
    }
    this.roomDetails.sort((a: any, b: any) => a.priority - b.priority);
    // console.log(this.roomDetails)
    this.pillarRectData.forEach(pillar=>{
      let pillarRect =new Konva.Rect({
        x:pillar.x,
        y:pillar.y,
        width:pillar.width,
        height:pillar.height,
        stroke:'black',
        strokeWidth:0.4,
        opacity:0.5
      })
      this.layer.add(pillarRect)
    })
    this.readTheBorderRoom();
  }
  startPoints_X: any;
  startPoints_Y: any;
  endingPoints_X: any;
  endingPoints_Y: any;
  readTheBorderRoom() {
    let roomDrawnComplete = false;
    let columns: any[] = []; // Array to store the columns of rooms
    let passages: any[] = [];
    let column: any[] = [];
    this.layoutData.forEach((borderRoom) => {
      let startX = borderRoom.startX;
      let startY = borderRoom.startY;
      let endX = borderRoom.endX;
      let endY = borderRoom.endY;
      let drawPassage = false;

        let x = startX;
        let y = startY;
        let previosWidth;
        // Array to store rooms in the current column
        for (let i = 0; i < this.roomDetails.length; i++) {
          const room = this.roomDetails[i];
          if(room.drawn==false){
          this.startPoints_X = startX;
          this.startPoints_Y = startY;
            for (let j = 0; j < room.selectedCount; j++) {
              if (room.dimensions.width <= 3 * this.seatWidth &&room.dimensions.height <= 3 * this.seatHeight &&room.title !== '8p Meeting') {
                for (let pillar of this.pillarRectData) {
                  if (
                    x + 1 < pillar.x + pillar.width &&
                    x + room.dimensions.width > pillar.x + 2 &&
                    y + 1 < pillar.y + pillar.height &&
                    y + room.dimensions.height > pillar.y + 2
                  ) {
                    y = pillar.y + pillar.height;
                  }
                }
              }

              if (y + room.dimensions.height >= endY) {
                let higherWidthExists = column.some((room) => room.width > column[0].width); //checks for higher width exists in one column
                if (higherWidthExists) {
                  column.sort((a, b) => a.width - b.width);
                  let newY = startY; // starting y value
                  for (let i = 0; i < column.length; i++) {
                    column[i].y = newY;
                    newY += column[i].height;
                  }
                }
                let workstationContains = column.some(
                  (room) => room.title == 'Workstation4x2'
                ); //checks for worsktations exists in one column
                let higherHeightExists = column.some(
                  (room) => room.height > column[0].height
                ); //checks for greater height exists in one column
                if (
                  higherHeightExists &&
                  workstationContains &&
                  !higherWidthExists
                ) {
                  column.sort((a, b) => b.height - a.height);
                  let newY = startY; // starting y value
                  for (let i = 0; i < column.length; i++) {
                    column[i].y = newY;
                    newY += column[i].height;
                  }
                }
                let uniqueWidths = new Map();
                column.forEach((roomCol) => {
                  let width = roomCol.width;
                  if (uniqueWidths.has(width)) {
                    let widthInfo = uniqueWidths.get(width);
                    widthInfo.count += 1;
                    widthInfo.rooms.push(roomCol);
                  } else {
                    uniqueWidths.set(width, { count: 1, rooms: [roomCol] });
                  }
                });

                let mostCommonWidth: any;
                let maxCount = 0;
                if (Array.from(uniqueWidths.keys()).length > 1) {
                  uniqueWidths.forEach((value, key) => {
                    let valuess: any = JSON.parse(JSON.stringify(value));
                    console.log(`${key}: ${valuess.rooms[0].title}`);
                    if (value.count > maxCount) {
                      maxCount = value.count;
                      mostCommonWidth = key;
                    }
                  });

                  uniqueWidths.forEach((value, key) => {
                    if (key !== mostCommonWidth && key > mostCommonWidth) {
                      value.rooms.forEach((room: any, index: number) => {
                        let ratio = room.width - mostCommonWidth;
                        if (index == 0) {
                          x -= ratio;
                        }
                        index++;
                        room.width = mostCommonWidth;
                        room.error=true
                      });
                    } else if (key !== mostCommonWidth && key < mostCommonWidth) {
                      value.rooms.forEach((room: any, index: number) => {
                        let ratio = room.width - mostCommonWidth;
                        if (index == 0) {
                          if (
                            room.title == 'Workstation4x2' ||
                            room.title == 'Cubical'
                          ) {
                            x -= ratio;
                          }
                        }
                        index++;
                        room.width = mostCommonWidth;
                        room.error=true
                      });
                    }
                  });
                }

                let modifiedColumn: any[] = [];

                uniqueWidths.forEach((value, key) => {
                  modifiedColumn = modifiedColumn.concat(value.rooms);
                });

                columns.push(modifiedColumn);

                column = [];
                y = startY;
                x += previosWidth;
                if (!drawPassage) {
                  // this.drawPassageInRoom(x, y, this.seatWidth, endY - startY, 'green');
                  passages.push({
                    x: x,
                    y: startY,
                    width: this.seatWidth,
                    height: endY - startY,
                    color: 'green',
                    title: 'passage',
                  });
                  x += this.seatWidth;
                  drawPassage = true;
                } else {
                  drawPassage = false;
                }
                if(x+room.dimensions.width>=endX && j>=room.selectedCount-1){

                  break
              }else if(x+room.dimensions.width>=endX&& j<room.selectedCount-1 ){

                  room.drawn=false
                  room.selectedCount-=j
                  break
              }
              }

              column.push({
                x: x,
                y: y,
                width: room.dimensions.width,
                height: room.dimensions.height,
                color: room.color,
                title: room.title,
                error: false,
              });
              room.drawn=true
              y += room.dimensions.height;
              previosWidth = room.dimensions.width;
              if(x+room.dimensions.width>=endX && j>=room.selectedCount-1){
                  break
              }else if(x+room.dimensions.width>=endX ){
                  room.drawn=false
                  room.selectedCount=j-room.selectedCount
                  break
              }
            }
          }
        }

        if (column.length > 0) {
          let uniqueWidths = new Map();
          column.forEach((roomCol) => {
            let width = roomCol.width;
            if (uniqueWidths.has(width)) {
              let widthInfo = uniqueWidths.get(width);
              widthInfo.count += 1;
              widthInfo.rooms.push(roomCol);
            } else {
              uniqueWidths.set(width, { count: 1, rooms: [roomCol] });
            }
          });

          let mostCommonWidth: any;
          let maxCount = 0;
          uniqueWidths.forEach((value, key) => {
            let valuess: any = JSON.parse(JSON.stringify(value));
            console.log(`${key}: ${valuess.rooms[0].title}`);
            if (value.count > maxCount) {
              maxCount = value.count;
              mostCommonWidth = key;
            }
          });
          if (Array.from(uniqueWidths.keys()).length > 1) {
            uniqueWidths.forEach((value, key) => {
              if (key !== mostCommonWidth) {
                value.rooms.forEach((room: any, index: number) => {
                  let ratio = key - mostCommonWidth;
                  if (index == 0) {
                    x -= ratio;
                  }
                  index++;
                  room.width = mostCommonWidth;
                  room.error=true
                });
              }
            });
          }

          // Adding modified data into columns
          let modifiedColumn: any[] = [];
          uniqueWidths.forEach((value, key) => {
            modifiedColumn = modifiedColumn.concat(value.rooms);
          });
          columns.push(modifiedColumn);

          this.endingPoints_X = x + column[column.length - 1].width;
          this.endingPoints_Y = endY;
          if (!drawPassage) {
            // this.drawPassageInRoom(column[column.length-1].x+column[column.length-1].width, startY, this.seatWidth, endY - startY, 'green');
            passages.push({
              x: column[column.length - 1].x + column[column.length - 1].width,
              y: startY,
              width: this.seatWidth,
              height: endY - startY,
              color: 'green',
              title: 'passage',
            });
            this.endingPoints_X += this.seatWidth;
          }
        }


      // }
    });
    if(column.length>0){
      console.log(column,"REMAINING ROOM")
    }
    // Draw rooms in columns

    this.columnsData=columns
    // columns.forEach((column) => {
      this.rearrangeTheColumns().forEach((room: any) => {
        this.drawRoom(
          room.x,
          room.y,
          room.width,
          room.height,
          room.color,
          room.title,
          room.error
        );
      });
    // });
    passages.forEach((pasage) => {
      this.drawRoom(
        pasage.x,
        pasage.y,
        pasage.width,
        pasage.height,
        pasage.color,
        pasage.title,
        false
      );
    });

  }

  columnsData:any[]=[]
  drawBorderAfterRoomDrawn() {
    console.log({
      x: this.startPoints_X,
      y: this.startPoints_Y,
      width: this.endingPoints_X - this.startPoints_X,
      height: this.endingPoints_Y - this.startPoints_Y,
    });
    const rect = new Konva.Rect({
      x: this.startPoints_X,
      y: this.startPoints_Y,
      width: this.endingPoints_X - this.startPoints_X,
      height: this.endingPoints_Y - this.startPoints_Y,
      stroke: 'red',
      strokeWidth: 1,
      id: 'border',

      draggable: true,
    });
    rect.cache()
    this.layer.add(rect);
  }


  drawRoom(
    x: number,
    y: number,
    width: number,
    height: number,
    color: any,
    title: any,
    error:any
  ) {
    // console.log('X=',x,'Y=',y,'width=',width,'height=',height)
    let strokeColor:any=error? 'red' : 'black';
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: color,
      opacity: error?0.8:0.3,
      stroke: strokeColor,
      strokeWidth: error?1:0.5,
      id: 'rect1',
      name: `room-rectangle-${title}`,
      draggable: true,
    });
// rect.cache()
    this.layer.add(rect);
    if (
      title !== 'Workstation4x2' &&
      title !== 'Workstation3x2' &&
      title !== 'Workstation5x2' &&
      title !== 'passage'
    ) {
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
        id: 'titles',
        name: 'room-names',
        wrap: `${title}`,
      });

      this.layer.add(titleOfRoom);
    }

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


  rearrangeTheColumns(){
    let columns=this.columnsData
      let mergedArray:any[] = columns.reduce((acc, curr) => acc.concat(curr), []);
      return mergedArray;
  }




}
