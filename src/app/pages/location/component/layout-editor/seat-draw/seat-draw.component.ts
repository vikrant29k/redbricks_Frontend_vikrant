import { Component, OnInit } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import Konva from 'konva';
import * as roomsData from '../seat-draw/roomCountsData.json'
export interface RoomData {
  [key: string]: {
    count: number;
    color: string;
    width:number;
    height:number;
  };
}

@Component({
  selector: 'app-seat-draw',
  templateUrl: './seat-draw.component.html',
  styleUrls: ['./seat-draw.component.scss']
})
export class SeatDrawComponent implements OnInit {
  roomsDataObject: RoomData = roomsData;
  imageOptions = Object.keys(this.roomsDataObject).map((key) => ({
    label: key,
    value: key,
  }));

  selectedImage!:string
  stage!: Konva.Stage|any;
  layer!: Konva.Layer;
  customWidth = 1080;
  customHeight = 734;
  constructor( private route: ActivatedRoute,
               private locationService: LocationService,
               private proposalService: ProposalService,
             ) {}
  id!: string;
  imageUrl:any;
  proposalData:any[]=[]
  seatHeight!:number;
  seatWidth!:number;
  content:any;
  // pillarData:any[]=[]
  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
    this.proposalService.getProposalById(this.id).subscribe((res:any)=>{
      this.extractProposalData(res[0]);
      this.content=res[0].content
      this.locationService.getImageById(res[0].locationId).subscribe(
        (imageUrl) => {
          this.imageUrl = environment.baseUrl+'images/' + imageUrl;
          const imageObj = new Image();
      imageObj.onload = () => {
        this.initializeKonva(imageObj);
        this.enableZoom();

        this.drawTheSeat()
        // this.seprateData()
      };
      imageObj.src = this.imageUrl;
        },
        error => {
          console.error('Error loading image data:', error);
        }
      );
    })
  }
  private extractProposalData(res: any): void {
      if (res.seatsData && res.seatsData.length > 0 && res.seatSize) {
        this.seatHeight=res.seatSize[0].height;
        this.seatWidth=res.seatSize[0].width;
        const resObject = {
            clientName:res.clientName,
            totalNumberOfSeats:res.totalNumberOfSeats,
            seatsData: res.seatsData.map((seat:any, index:any) => ({
                ...seat,
                first: index === 0, // Set "first" to true for the first object, false for others
            })),
            seatSize: res.seatSize,
            color: res.color,
        };
        this.proposalData.push(resObject);
    }
    // console.log(this.proposalData)
  }

  backgroundImage!: Konva.Image;
  newLayerForMovingObjects!:Konva.Layer;
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
    this.newLayerForMovingObjects = new Konva.Layer({
      name:'movingLayer'
    })
    this.stage.add(this.newLayerForMovingObjects)
    this.backgroundImage = new Konva.Image({
      image: imageObj,
      width: this.customWidth,
      height: this.customHeight,
    });

    this.layer.add(this.backgroundImage);
    this.layer.draw();
  }
  //for Zooming REQUIRED
  enableZoom(): void {
    const scaleBy = 1.1; // Adjust the scale factor as needed
    this.stage.on('wheel', (e:any) => {
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
  //reset the zoom REQUIRED
  resetZoomAndPosition(): void {
    // Set the initial scale and position values as per your original configuration
    const initialScale = 1;
    const initialPosition = { x: 0, y: 0 };

    this.stage.scale({ x: initialScale, y: initialScale });
    this.stage.position(initialPosition);
    this.stage.batchDraw();
  }
  startingPointOfSeatX!:number;
  startingPointOfSeatY!:number;
  //drawing the seats of selected proposal REQUIRED

  showDataInHml:any
    roomDetails:any[]=[]
    sepratedContent:any[]=[]

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
              count: jsonData.count * count,
              selectedCount:count,
              dimensions:{width:jsonData.width*this.seatWidth,height:jsonData.height * this.seatHeight},
              color: jsonData.color,
              drawn:false
            };
            this.roomDetails.push(commonObject);
            this.roomDetails.sort((a:any,b:any)=>b.count - a.count)
          }
        }
      }
      // console.log(this.roomDetails)
      }

      //seat draw
      drawTheSeat() {
        this.proposalData.forEach(dataOfSeats => {
          // Sort seatsData based on X position in ascending order
          dataOfSeats.seatsData.sort((a: any, b: any) => a.start.x - b.start.x);
          dataOfSeats.seatsData.forEach((seat: any) => {
            // Find the corresponding room data
            // const roomData = this.roomDetails.find(room => room.title === seat.roomName);

            // if (roomData) {
              const seatRect = new Konva.Rect({
                x: seat.start.x,
                y: seat.start.y,
                width: dataOfSeats.seatSize[0].width,
                height: dataOfSeats.seatSize[0].height,
                fill:'blue', // Use the room's color
                opacity: 0.4,
                draggable: true,
                name: 'seat-rectangle'
              });

              this.layer.add(seatRect);
            // }
          });
        });

        this.layer.draw();
        this.drawBorder();
        this.seprateData()
      }

      //border draw
//       drawBorder() {
//         const seatRectangles = this.layer.find('.seat-rectangle');
//         if (seatRectangles.length === 0) {
//           return;
//         }
// //gap


//         let minX = seatRectangles[0].x();
//         let minY = seatRectangles[0].y();
//         let maxX = seatRectangles[0].x() + seatRectangles[0].width();
//         let maxY = seatRectangles[0].y() + seatRectangles[0].height();
//         seatRectangles.forEach((seat: any) => {
//           const seatX = seat.x();
//           const seatY = seat.y();
//           const seatWidth = seat.width();
//           const seatHeight = seat.height();

//           minX = Math.min(minX, seatX);
//           minY = Math.min(minY, seatY);
//           maxX = Math.max(maxX, seatX + seatWidth);
//           maxY = Math.max(maxY, seatY + seatHeight);
//         });

//         const width = maxX - minX;
//         const height = maxY - minY;

//         const borderRect = new Konva.Rect({
//           x: minX,
//           y: minY,
//           width: width,
//           height: height,
//           stroke: 'red',
//           strokeWidth: 0.8,
//           name:'border-rectangle'
//         });
//         let transformer = new Konva.Transformer({
//           nodes:[borderRect]
//         })
//         this.layer.add(borderRect,transformer);
//         this.layer.batchDraw();

//       }
drawBorder() {
  const threshold = 2; // Set the threshold value

  const seatRectangles = this.layer.find('.seat-rectangle');
  if (seatRectangles.length === 0) {
    return;
  }

  let minX = seatRectangles[0].x();
  let minY = seatRectangles[0].y();
  let maxX = seatRectangles[0].x() + seatRectangles[0].width();
  let maxY = seatRectangles[0].y() + seatRectangles[0].height();

  let availableSpace = [];

  let currentX = minX;
  let currentY = minY;

  seatRectangles.forEach((seat) => {
    const seatX = seat.x();
    const seatY = seat.y();
    const seatWidth = seat.width();
    const seatHeight = seat.height();

    minX = Math.min(minX, seatX);
    minY = Math.min(minY, seatY);
    maxX = Math.max(maxX, seatX + seatWidth);
    maxY = Math.max(maxY, seatY + seatHeight);

    // Calculate the gap between the current seat and the next seat
    const gap = seatX - currentX;

    if (gap >= threshold) {
      // There is enough space (threshold) between seats
      availableSpace.push({
        x: currentX,
        y: currentY,
        width: gap,
        height: maxY - minY,
      });
    }

    // Update the current position for the next iteration
    currentX = seatX + seatWidth;
    if (currentX > maxX) {
      currentX = minX;
      currentY += seatHeight;
    }
  });

  // Calculate and add the remaining space on the right side
  if (currentX < maxX) {
    availableSpace.push({
      x: currentX,
      y: currentY,
      width: maxX - currentX,
      height: maxY - minY,
    });
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const borderRect = new Konva.Rect({
    x: minX,
    y: minY,
    width: width,
    height: height,
    stroke: 'red',
    strokeWidth: 0.8,
    name: 'border-rectangle',
  });
  console.log('Before transform - Width:', borderRect.width(), 'Height:', borderRect.height(),'x:', borderRect.x(),'y:', borderRect.y());

  let transformer = new Konva.Transformer({
    nodes: [borderRect],
  });
  borderRect.on('transformend', () => {
    const newWidth = borderRect.width() * borderRect.scaleX();
    const newHeight = borderRect.height() * borderRect.scaleY();
    console.log('After transform - Width:', newWidth, 'Height:', newHeight,'x:', borderRect.x(),'y:', borderRect.y());
    this.layer.batchDraw(); // Redraw the layer
  });
  this.layer.add(borderRect, transformer);
  // Add gaps as rectangles (for debugging or custom purposes)
  availableSpace.forEach((space) => {
    const gapRect = new Konva.Rect({
      x: space.x,
      y: space.y,
      width: space.width,
      height: space.height,
      fill: 'green',
      opacity:0.8,
      stroke: 'black',
      strokeWidth: 0.5,
    });
    this.layer.add(gapRect);
  });

  this.layer.batchDraw();
}


      drawPassage(x:number,y:number,width:number,height:number){
        let rect=new Konva.Rect({
          x:x,
          y:y,
          width:width,
          height:height,
          fill:'red',
          opacity:0.8,
          stroke:'black',
          strokeWidth:0.5
        })
        this.layer.add(rect)
      }
      clearAndRedrawSeats() {
        // Clear existing seats from the layer
        const seatRectangles = this.layer.find('.seat-rectangle');
        seatRectangles.forEach((seat: any) => {
          seat.destroy();
        });
        const borderRect = this.layer.find('.border-rectangle')[0];
        if (!borderRect) {
          return; // No border found, can't place seats
        }
        const borderX = borderRect.x();
        const borderY = borderRect.y();
        const borderWidth = borderRect.width();
        const borderHeight = borderRect.height();

        let borderMinX = borderX;
        let borderMaxX = borderX + borderWidth;
        let borderMinY = borderY;
        let borderMaxY = borderY + borderHeight;

        // Keep track of the current X and Y positions for adding seats
        let currentX = borderMinX;
        let currentY = borderMinY;

        // Redraw seats inside the border based on the room details
        this.roomDetails.forEach((roomDetail) => {
          console.log(roomDetail, "HI");

          // Create each room rects as per roomDetails
          for (let i = 0; i < roomDetail.selectedCount; i++) {
            // Calculate the new X and Y positions for the current seat
            let newX = currentX;
            let newY = currentY;

            // Check if the new seat will cross the borderMaxX
            if (newX + roomDetail.dimensions.width >= borderMaxX) {
              // Move to the next row
             newX= currentX = borderMinX;
              newY = currentY += roomDetail.dimensions.height;
            }

            // Check if the new seat will go outside the borderMaxY
            // if (newY + roomDetail.dimensions.height >= borderMaxY) {
            //   // You may want to handle this case, e.g., show a message or stop adding seats
            //   return;
            // }

            // Create the rectangle and add it to the layer
            let rect = new Konva.Rect({
              x: newX,
              y: newY,
              width: roomDetail.dimensions.width,
              height: roomDetail.dimensions.height,
              fill: roomDetail.color,
              draggable: true,
              opacity: 0.5,
              stroke:'black',
              strokeWidth:0.8
            });
            rect.on('dragstart',()=>{
              rect.moveTo(this.newLayerForMovingObjects)
            })
            rect.on('dragend',()=>{
              rect.moveTo(this.layer)
            })
            this.layer.add(rect);

            // Update the currentX for the next seat
            currentX = newX + roomDetail.dimensions.width;
          }

        });

        this.layer.draw();
      }




}
