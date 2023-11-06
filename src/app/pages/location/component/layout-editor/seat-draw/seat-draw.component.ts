//SEAT DRAW DESIGN CHA CODE NOVember 2
import { Component, OnInit } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ActivatedRoute,Route,Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BorderDataService } from '../../../module/service/border-data.service';
import Konva from 'konva';
import * as imageSize from '../seat-draw/imageFile.json'
import * as roomsData from '../seat-draw/roomCountsData.json'
export interface RoomData {
  [key: string]: {
    count: number;
    color: string;
    width:number;
    height:number;
  };
}
export interface ImageData{
  [key: string]: {
    path:string,
    width: number;
    height: number;
  };
}
@Component({
  selector: 'app-seat-draw',
  templateUrl: './seat-draw.component.html',
  styleUrls: ['./seat-draw.component.scss']
})
export class SeatDrawComponent implements OnInit {
  roomsDataObject: RoomData = roomsData;
  imageSizeData: ImageData = imageSize;
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
               private router:Router,
               private borderDataService:BorderDataService
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

        this.drawTHeSeat()
        this.seprateData()
      };
      imageObj.src = this.imageUrl;
        },
        error => {
          console.error('Error loading image data:', error);
        }
      );
      // this.locationService.getBorderData(res[0].locationId).subscribe((res:any)=>{
      //     res.layoutArray[0].pillarData.forEach((item:any) => {
      //       const {_id, startX, startY, pillarRect,pilarWidth } = item;
      //       this.pillarData.push({_id, startX, startY,pillarRect,pilarWidth });

      //     });
      // })

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
  drawTHeSeat() {
    this.proposalData.forEach(dataOfSeats => {
      // Sort seatsData based on X position in ascending order
      // dataOfSeats.seatsData.sort((a:any, b:any) => a.start.y - b.start.y);
   // Draw the seats
      dataOfSeats.seatsData.forEach((seat:any) => {
        const seatRect = new Konva.Rect({
          x: seat.start.x,
          y: seat.start.y,
          width: dataOfSeats.seatSize[0].width,
          height: dataOfSeats.seatSize[0].height,
          fill: 'blue',
          opacity: 0.4,
          name:'seat-rectangle'
        });
        this.newLayerForMovingObjects.add(seatRect);
        // lighterFactor += 0.015;
      });

    });

    this.layer.draw();
  }

  sepratedContent:any[]=[]
  selectedRoom:any[]=[];
  showDataInHml:any[]=[]
  // roomTitles:any

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
  const commonObjectsWithCounts = [];

  for (const key in this.sepratedContent) {
    if (this.sepratedContent.hasOwnProperty(key)) {

      if (this.roomsDataObject[key]) {
        const count = this.sepratedContent[key];
        const jsonData = this.roomsDataObject[key];
        const commonObject = {
          title: key,
          count: jsonData.count * count,
          selectedCount:count,
          color: jsonData.color,
          width:jsonData.width,
          height:jsonData.height
        };
        commonObjectsWithCounts.push(commonObject);
      }
    }
  }
  this.showDataInHml=commonObjectsWithCounts
  commonObjectsWithCounts.sort((a, b) => b.count - a.count);

  this.assignRoomsToSeats(commonObjectsWithCounts)

    }
    // assignRoomsToSeats(commonObjectsWithCounts: any[]) {
    //   console.log(commonObjectsWithCounts )
    //   const seatRectangles = this.layer.find('.seat-rectangle');
    //   let currentSeatIndex = 0;
    //   commonObjectsWithCounts.forEach((room: any) => {
    //     const roomSeats:any = [];
    //     const group = new Konva.Group({ draggable: true });
    //     for (let i = 0; i < room.count; i++) {
    //       const seat: any = seatRectangles[currentSeatIndex];
    //       if (seat) {
    //         roomSeats.push(seat);
    //         seat.fill(room.color);
    //       } else {
    //         break;
    //       }
    //       currentSeatIndex++;
    //     }
    //   });

    //   this.layer.batchDraw();
    // }

    assignRoomsToSeats(commonObjectsWithCounts: any[]) {
      const seatRectangles: any = this.newLayerForMovingObjects.find('.seat-rectangle');
      let currentSeatIndex = 0;

      const seatGroups: any = [];

      commonObjectsWithCounts.forEach((room: any) => {
        const roomSeats:any = [];

        // Use the selectedCount for the number of seats in the room
        for (let i = 0; i < room.selectedCount; i++) {
          const seat = seatRectangles[currentSeatIndex];

          if (seat) {
            // Set the seat dimensions as multiples of the seat's width and height
            seat.width(room.width * this.seatWidth); // seatWidth is the width of a single seat
            seat.height(room.height * this.seatHeight); // seatHeight is the height of a single seat

            // Maintain the previous seat's position
            seat.x(seat.x());
            seat.y(seat.y());

            // Check for collisions with other seats in the same room and adjust if needed
            let positionAdjusted = false;

            while (!positionAdjusted) {
              // Calculate a random offset within the room's dimensions
              const xOffset = seat.x();
              const yOffset = seat.y();

              // Adjust the seat's position based on the offset
              seat.x(seat.x() + xOffset);
              seat.y(seat.y() + yOffset);

              // Check for collisions with other seats in the same room
              const collisionDetected = roomSeats.some((otherSeat:any) => {
                const seatRect = seat.getClientRect();
                const otherSeatRect = otherSeat.getClientRect();

                // Adjust the collision logic as needed based on the shape and dimensions
                if (
                  seatRect.x < otherSeatRect.x + otherSeatRect.width &&
                  seatRect.x + seatRect.width > otherSeatRect.x &&
                  seatRect.y < otherSeatRect.y + otherSeatRect.height &&
                  seatRect.y + seatRect.height > otherSeatRect.y
                ) {
                  return true; // Collision detected
                }

                return false;
              });

              if (!collisionDetected) {
                positionAdjusted = true;
              }
            }

            seat.fill(room.color);
            seat.stroke('black')
            seat.strokeWidth(0.5)
            roomSeats.push(seat);
          } else {
            break;
          }

          currentSeatIndex++;
        }

        if (roomSeats.length > 0) {
          const seatGroup = new Konva.Group({
            draggable: true,
          });

          roomSeats.forEach((seat:any) => {
            seat.on('dblclick', () => {

              seat.draggable(true);
            });
            seat.on('wheel',()=>{
              let transformer = new Konva.Transformer({
                nodes:[seat],
                draggable:true
              })
              this.newLayerForMovingObjects.add(transformer)
            })
            seatGroup.add(seat);
          });

          seatGroups.push(seatGroup);
        }
      });

      // Clear the existing seats
      this.newLayerForMovingObjects.removeChildren();

      // Add the new seat groups
      this.newLayerForMovingObjects.add(...seatGroups);
      this.newLayerForMovingObjects.batchDraw();
    }



 transformer: Konva.Transformer | any;
 transformerActive = false;

loadImage() {
  const image = new Image();
  // console.log(this.getImagePath(),"YOOOOOOOOOOOOOo")
  image.src = this.getImagePath().imge;
  image.width =this.getImagePath().width;
  image.height=this.getImagePath().height;
  image.onload = () => {
    const konvaImage = new Konva.Image({
      x: this.startingPointOfSeatX,
      y: this.startingPointOfSeatY,
      image: image,
      width: image.width,
      height: image.height,
      draggable: true
    });

    const layer = new Konva.Layer();
    layer.add(konvaImage);

    this.stage.add(layer);

    layer.draw();

    layer.on('dblclick', () => {
      if (this.transformerActive) {
        if (this.transformer) {
          this.transformer.destroy();
          this.transformer = null;
        }
      } else {
        this.transformer = new Konva.Transformer();
        this.transformer.nodes([konvaImage])
        layer.add(this.transformer);

        layer.batchDraw();
      }
      this.transformerActive = !this.transformerActive;
    });
  };
}
drawImages(commonObjectsWithCounts:any[]) {
  // const layer = new Konva.Layer(); // Create a new layer for the images

  // Loop through the array of image data
  commonObjectsWithCounts.forEach((imageData) => {
    const image = new Image();
    image.src = imageData.path;

    // Create a Konva.Image for each image
    const konvaImage = new Konva.Image({
      x: this.startingPointOfSeatX, // Set the x position
      y: this.startingPointOfSeatY, // Set the y position
      image: image,
      width: imageData.width,
      height: imageData.height,
      draggable: true,
    });

    // Add the Konva.Image to the layer
   this.layer.add(konvaImage);
  });

  // Add the layer to the stage and draw it
  this.layer.draw();
}

    imgWidth!:number;
    imgHeight!:number;
    getImagePath(): any {
      let data={
        imge:this.imageSizeData[this.selectedImage].path,
        width:this.imageSizeData[this.selectedImage].width*this.imgWidth,
        height:this.imageSizeData[this.selectedImage].height*this.imgHeight
      }
      return data;
    }

}
