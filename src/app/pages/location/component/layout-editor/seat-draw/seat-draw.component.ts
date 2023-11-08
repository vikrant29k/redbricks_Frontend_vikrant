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
  let transformer = new Konva.Transformer({
    nodes: [borderRect],
  });
  this.layer.add(borderRect, transformer);
  console.log(borderRect.x(),"BEFOREEEEE",borderRect.width());
  let afterTransformX=borderRect.x();
  let afterTransformY=borderRect.y();
  let afterTransformWidth=borderRect.width();
  let afterTransformHeight=borderRect.height();
  borderRect.on('transform', () => {
    afterTransformX=borderRect.x();
    afterTransformY=borderRect.y();
    afterTransformWidth=borderRect.width()*borderRect.scaleX();
    afterTransformHeight=borderRect.height()*borderRect.scaleY();

  });
  borderRect.on('transformend',()=>{
    borderRect.x(afterTransformX);
    borderRect.y(afterTransformY);
    borderRect.width(afterTransformWidth);
    borderRect.height(afterTransformHeight)
     // Reset the scale of the transformer so it doesn't affect future transformations
  transformer.nodes([borderRect]);
  transformer.detach();
  transformer.nodes([borderRect]);
  this.layer.batchDraw()
    console.log(borderRect.x(),"AFTER",borderRect.width());
  })




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
      name:'passage-rect'
    });
    this.layer.add(gapRect);
  });

  this.layer.batchDraw();
}
clearAndRedrawSeats() {
  // Clear existing seats from the layer
  const seatRectangles = this.layer.find('.seat-rectangle');
  seatRectangles.forEach((seat) => {
    seat.destroy();
  });

  const borderRect = this.layer.find('.border-rectangle')[0];
  if (!borderRect) {
    return; // No border found, can't place seats
  }

  const passages = this.layer.find('.passage-rect');
  if (passages.length==0) {
    const borderX = borderRect.x();
    const borderY = borderRect.y();
    const borderWidth = borderRect.width();
    const borderHeight = borderRect.height();
   const maxYPoint = borderRect.y()+borderRect.height()
   const maxXPoint = borderRect.x()+borderRect.width()
   let currentX=borderX;
   let currentY=borderY;
   this.roomDetails.forEach(roomDetail=>{
    console.log(roomDetail.title)
    for(let i=0;i<roomDetail.selectedCount;i++){
      if(currentX+roomDetail.dimensions.width<=maxXPoint+2){

    }else{
      currentX=borderX;
       currentY+=roomDetail.dimensions.height;

    }
    console.log(roomDetail.title)
    let rect = new Konva.Rect({
      x:currentX,
      y:currentY,
      width:roomDetail.dimensions.width,
      height:roomDetail.dimensions.height,
      fill: roomDetail.color,
      opacity:0.7,
      stroke:'black',
      strokeWidth:0.5,
      draggable:true
    })
    this.layer.add(rect);
    currentX+=roomDetail.dimensions.width
    }

    })


  }else{
    let remainingRects:any=[]
  const borderX = borderRect.x();
  const borderY = borderRect.y();
  const borderWidth = borderRect.width();
  const borderHeight = borderRect.height();
 const maxYPoint = borderRect.y()+borderRect.height()
  passages.forEach(passages=>{
      let currentY = passages.y()
      let currentYright = passages.y()
      const passagesX = passages.x();
      const passagesWidth = passages.width();
      let leftAvailableSpace = passagesX - borderX;
      let rightAvailableSpace = (borderX + borderWidth) - (passagesX + passagesWidth);

        console.log(leftAvailableSpace,rightAvailableSpace)
        this.roomDetails.forEach(roomDetail=>{
          for(let i = 0; i<roomDetail.selectedCount;i++){
            if(roomDetail.dimensions.width<rightAvailableSpace){
              if(currentYright+roomDetail.dimensions.height <maxYPoint+2){
                let rect = new Konva.Rect({
                  x:passages.x()+passages.width(),
                  y:currentYright,
                  width:roomDetail.dimensions.width,
                  height:roomDetail.dimensions.height,
                  fill: roomDetail.color,
                  opacity:0.7,
                  stroke:'black',
                  strokeWidth:0.5,
                  draggable:true
                })
                this.layer.add(rect);

              }else{
                remainingRects.push(roomDetail)
              }

              currentYright+=roomDetail.dimensions.height

            }else{
              if(currentY+roomDetail.dimensions.height<maxYPoint+2){
                let rect = new Konva.Rect({
                  x:passagesX,
                  y:currentY,
                  width:-roomDetail.dimensions.width,
                  height:roomDetail.dimensions.height,
                  fill: roomDetail.color,
                  opacity:0.7,
                  stroke:'black',
                  strokeWidth:0.5,
                  draggable:true
                })
                this.layer.add(rect);

              }else{
                remainingRects.push(roomDetail)
              }

              currentY+=roomDetail.dimensions.height

            }

          }
  })
  this.layer.draw();
  console.log(remainingRects)
  if(remainingRects){
    let startingPointX = borderX;
    let startinPointY = borderY;
    remainingRects.sort((a:any,b:any)=>a.count - b.count);
    remainingRects.forEach((roomDetails:any)=>{
      for(let i =0;i<roomDetails.selectedCount;i++){
        if(startinPointY+roomDetails.dimensions.height<maxYPoint){
          let rect = new Konva.Rect({
            x:startingPointX ,
            y:startinPointY,
            width:roomDetails.dimensions.width,
            height:roomDetails.dimensions.height,
            fill: roomDetails.color,
            opacity:0.7,
            stroke:'black',
            strokeWidth:0.5,
            draggable:true
          })
          this.layer.add(rect);
          startinPointY+=roomDetails.dimensions.height
          // remainingRects.pop(roomDetails)
        }else{
          remainingRects.push(roomDetails)
        }


      }

    })
    console.log(remainingRects)
    this.layer.draw()
  }
})

  }

}
// clearAndRedrawSeats() {
//   // Clear existing seats from the layer
//   const seatRectangles = this.layer.find('.seat-rectangle');
//   seatRectangles.forEach((seat) => {
//     seat.destroy();
//   });

//   const borderRect = this.layer.find('.border-rectangle')[0];
//   if (!borderRect) {
//     return; // No border found, can't place seats
//   }

//   const passages = this.layer.find('.passage-rect');
//   if (!passages || passages.length === 0) {
//     return; // No passages found, can't place seats
//   }
//   const minXPoint = borderRect.x()
//   const maxXPoint = borderRect.x() + borderRect.width();
//   const maxYPoint = borderRect.y() + borderRect.height()
//   // Sort the passages by their X positions
//   const sortedPassages = passages.sort((a, b) => a.x() - b.x());
//   const availablePassages = sortedPassages.map((passage) => {
//     return {
//       x: passage.x(),
//       y:passage.y(),
//       width: passage.width(),
//     };
//   });


//   this.roomDetails.sort((a:any,b:any)=>a.count-b.count)
//   let currentX=availablePassages[0].x;
//   let currentY=availablePassages[0].y;

//   this.roomDetails.forEach(roomDetail => {

//     for(let i=0;i<roomDetail.selectedCount;i++){
//       // for(let j=0;j<distances.length;j++){
//         console.log(roomDetail.dimensions.width,"<",availablePassages[0].x-minXPoint)
//         if(roomDetail.dimensions.width<availablePassages[0].x-minXPoint){
//           if(currentY+roomDetail.dimensions.height<maxYPoint){
//             if(currentX==availablePassages[0].x){
//               const rect = new Konva.Rect({
//                 x: currentX,
//                 y: currentY,
//                 width: -roomDetail.dimensions.width,
//                 height: roomDetail.dimensions.height,
//                 fill: roomDetail.color,
//                 opacity: 0.7,
//                 stroke: 'black',
//                 strokeWidth: 0.5,
//                 draggable: true,
//               });
//               this.layer.add(rect);
//           currentY+=roomDetail.dimensions.height;
//             }else{
//               const rect = new Konva.Rect({
//                 x: currentX,
//                 y: currentY,
//                 width: roomDetail.dimensions.width,
//                 height: roomDetail.dimensions.height,
//                 fill: roomDetail.color,
//                 opacity: 0.7,
//                 stroke: 'black',
//                 strokeWidth: 0.5,
//                 draggable: true,
//               });
//               this.layer.add(rect);
//           currentY+=roomDetail.dimensions.height;
//             }
//         }else{
//           currentY=availablePassages[0].y
//           currentX=availablePassages[0].x+availablePassages[0].width
//         }
//       }
//       }
// //
//     // }

//   });

//   this.layer.draw();



//   // let currentYPositions = Array(passages.length).fill(passages[0].y());
//   // console.log(currentYPositions)
//   // let currentPassageIndex = 0;

//   // this.roomDetails.forEach((roomDetail) => {
//   //   for (let i = 0; i < roomDetail.selectedCount; i++) {
//   //     while (currentPassageIndex < availablePassages.length) {
//   //       const passage = availablePassages[currentPassageIndex];
//   //       const currentY = currentYPositions[currentPassageIndex];

//   //       if (currentY + roomDetail.dimensions.height <= maxXPoint) {
//   //         const rect = new Konva.Rect({
//   //           x: passage.x,
//   //           y: currentY,
//   //           width: roomDetail.dimensions.width,
//   //           height: roomDetail.dimensions.height,
//   //           fill: roomDetail.color,
//   //           opacity: 0.7,
//   //           stroke: 'black',
//   //           strokeWidth: 0.5,
//   //           draggable: true,
//   //         });
//   //         this.layer.add(rect);

//   //         currentYPositions[currentPassageIndex] += roomDetail.dimensions.height;
//   //         break;
//   //       } else {
//   //         currentPassageIndex++;
//   //       }
//   //     }
//   //   }
//   // });

// }


}
