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
  pillarData:any[]=[]
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
      this.locationService.getBorderData(res[0].locationId).subscribe((res:any)=>{
          res.layoutArray[0].pillarData.forEach((item:any) => {
            const {_id, startX, startY, pillarRect,pilarWidth } = item;
            this.pillarData.push({_id, startX, startY,pillarRect,pilarWidth });

          });




      })

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
    console.log(this.proposalData)

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
  drawTHeSeat(){
    this.proposalData.forEach(dataOfSeats=>{
      for (const seat of dataOfSeats.seatsData) {
        this.drawSeatsBetweenPoints(seat.start, seat.end,seat.seatPosition,dataOfSeats.seatSize);

        if(seat.first){
          this.startingPointOfSeatX=seat.start.x;
          this.startingPointOfSeatY=seat.start.y;
          this.imgHeight=dataOfSeats.seatSize[0].height;
          this.imgWidth=dataOfSeats.seatSize[0].width;
          // console.log(this.startingPointOfSeatX,this.startingPointOfSeatY)
        }
      }
    })

  }
  drawSeatsBetweenPoints(start:any, end:any,seatPosition:any,seatSize:any) {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
    const seatSizeWidth = seatSize[0].width; // Extract width from seatSize
    const seatSizeHeight = seatSize[0].height; // Extract height from seatSize
    if(seatPosition==false){
      for (let x = startX; x < endX; x += seatSizeHeight) {
        for (let y = startY; y < endY; y += seatSizeWidth) {
          this.drawSeatRectangle(x, y,seatSizeWidth,seatSizeHeight);
        }
      }
    }else{
      for (let x = startX; x < endX; x += seatSizeWidth) {
        for (let y = startY; y < endY; y += seatSizeHeight) {
          this.drawSeatRectangle(x, y,seatSizeHeight,seatSizeWidth);
        }
      }
    }

  }

  drawSeatRectangle(x:any, y:any, height:number, width:number) {
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: 'transparent',
      stroke:'black',
      strokeWidth:0.3,
      opacity: 0.5,
      name: 'seat-rectangle',
      draggable:true
    });
    rect.on('dragstart',()=>{
      rect.moveTo(this.newLayerForMovingObjects)
    })
    rect.on('dragend',()=>{
      rect.moveTo(this.layer)
    })
    this.layer.add(rect);
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
    // this.roomTitles = Object.keys(this.sepratedContent);
  });

  // Now you have separated content as an object with individual properties
  // console.log("YEP",this.sepratedContent);
  const commonObjectsWithCounts = [];

  for (const key in this.sepratedContent) {
    if (this.sepratedContent.hasOwnProperty(key)) {
      // Check if the key exists in the JSON data
      if (this.roomsDataObject[key]) {
        const count = this.sepratedContent[key];
        const jsonData = this.roomsDataObject[key];

        // Create a new object with the multiplied count and color
        const commonObject = {
          title: key,
          count: jsonData.count * count,
          selectedCount:count,
          color: jsonData.color,
        };

        // Add the common object to the array
        commonObjectsWithCounts.push(commonObject);
      }
    }
  }

  // Now you have an array commonObjectsWithCounts containing common objects
  // console.log(commonObjectsWithCounts);
  this.showDataInHml=commonObjectsWithCounts

  this.assignRoomsToSeats(commonObjectsWithCounts)
  // this.drawImages(commonObjectsWithCounts)
    }
    assignRoomsToSeats(commonObjectsWithCounts: any[]) {
      console.log(commonObjectsWithCounts)
      const availableValues = commonObjectsWithCounts.map((item) => item.title);

// Filter the imageOptions array to include only options with values in availableValues
this.imageOptions = Object.keys(this.roomsDataObject)
  .filter((key) => availableValues.includes(key))
  .map((key) => ({
    label: key,
    value: key,
  }));
      // Find all seat rectangles in the layer
      const seatRectangles = this.layer.find('.seat-rectangle');

      let currentSeatIndex = 0;

      commonObjectsWithCounts.forEach((room: any) => {
        const roomSeats:any = [];
        const group = new Konva.Group({ draggable: true });
        for (let i = 0; i < room.count; i++) {
          const seat: any = seatRectangles[currentSeatIndex];
          if (seat) {
            roomSeats.push(seat);
            seat.fill(room.color); // Assign the room's color to the seat


          } else {
            break; // No more seats available for this room
          }
          currentSeatIndex++;
        }


      });

      // Redraw the layer to apply the changes to seat colors
      this.layer.batchDraw();
    }
   // Declare transformer and transformerActive outside the function
 transformer: Konva.Transformer | any;
 transformerActive = false;

loadImage() {
  const image = new Image();
  console.log(this.getImagePath(),"YOOOOOOOOOOOOOo")
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
    removeImage(){
      this.backgroundImage.destroy();
      this.circles.forEach(dta=>{
        dta.destroy()
      })
      this.borderPolygon.moveToBottom()
      this.layer.draw()

     }

     reAddImage() {
       const imageObj = new Image();
       imageObj.onload = () => {
         this.addimage(imageObj);
       };

       imageObj.src = this.imageUrl;

     }
     addimage(imageObj: HTMLImageElement) {
      // Create a new Konva.Image instance
      this.backgroundImage = new Konva.Image({
        width: this.customWidth,
        height: this.customHeight,
        image: imageObj, // Set the image source
      });

      // Add the image to the layer
      this.layer.add(this.backgroundImage);
      this.backgroundImage.moveToBottom();
      // Redraw the layer
      this.layer.draw();
    }

 borderPolygon!: Konva.Line;
circles: Konva.Circle[] = [];
drawBorder() {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  this.layer.find('.seat-rectangle').forEach((seatRect) => {
    const position = seatRect.position();
    const x = position.x;
    const y = position.y;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + seatRect.width());
    maxY = Math.max(maxY, y + seatRect.height());
  });

  // Create a polygon border around the seats
  this.borderPolygon = new Konva.Line({
    points: [minX, minY, maxX, minY, maxX, maxY, minX, maxY],
    closed: true,
    fill: 'transparent',
    stroke: 'red',
    strokeWidth: 1
  });

  this.layer.add(this.borderPolygon);

  // Initialize circles at the same coordinates as the polygon points
  const polygonPoints = this.borderPolygon.points();
  for (let i = 0; i < polygonPoints.length; i += 2) {
    const x = Math.round(polygonPoints[i]);
    const y = Math.round(polygonPoints[i+1])
    const x1 = x+10
    const y1 =  y+10
    console.log(x,y,x1,y1)
    const circle = new Konva.Circle({
      x,
      y,
      radius: 2,
      fill: 'blue',
      draggable: true
    });
    const circle2 = new Konva.Circle({
      x:x,
      y:y,
      radius: 2,
      fill: 'red',
      draggable: true
    });

    circle.on('dragmove', () => {
      this.updateBorderPolygon();
    });
    circle2.on('dragmove', () => {
      this.updateBorderPolygon();
    });
    circle.on('dragstart',()=>{
      circle.moveTo( this.newLayerForMovingObjects)
     })
    circle2.on('dragstart',()=>{
      circle2.moveTo( this.newLayerForMovingObjects)
     })
     circle.on('dragend',()=>{
      circle.moveTo( this.layer)
     })
     circle2.on('dragend',()=>{
      circle2.moveTo(this.layer)
     })
    this.circles.push(circle);
    this.circles.push(circle2)
    this.layer.add(circle,circle2);
  }

  this.layer.batchDraw();
}

pointsOfBorder:any;
updateBorderPolygon() {
  const points = this.circles.map(circle => [circle.x(), circle.y()]).flat();
  this.borderPolygon.points(points);
  this.pointsOfBorder=points
  this.layer.batchDraw();
  this.fillthePolygon()
}
fillthePolygon(){
  this.borderPolygon.fill('grey');
  this.borderPolygon.opacity(0.5)
}

pillarGapLayer!:Konva.Layer
//add pillars too
showOther(){
  this.pillarGapLayer=new Konva.Layer({
    name:'pillarGapLayer',
  })
  // this.layer.listening(false)
  this.stage.add(this.pillarGapLayer)
  this.pillarData.forEach(data=>{
    let rect = new Konva.Rect({
      x: data.startX,
      y: data.startY,
      width: data.pilarWidth,
      height: data.pillarRect,
      fill: 'gray',
      opacity: 0.7,
      stroke: 'transparent',
      strokeWidth: 0.01,
      shadowColor: 'black',
      shadowBlur: 7,
      shadowOffset: { x: 0, y: 1 },
      shadowOpacity: 0.5,
      name:String(data._id)
  })
  rect.cache()


  this.pillarGapLayer.add(rect)
})
this.pillarGapLayer.batchDraw()
}


gotoDrawImage(){
  this.borderDataService.setData(this.pointsOfBorder)
  this.borderDataService.setDataforrooms(this.showDataInHml)
  this.router.navigate(['/admin','location','addImage',this.id])

}
}
