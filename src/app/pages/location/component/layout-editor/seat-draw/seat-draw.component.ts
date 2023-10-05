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
  };
}

@Component({
  selector: 'app-seat-draw',
  templateUrl: './seat-draw.component.html',
  styleUrls: ['./seat-draw.component.scss']
})
export class SeatDrawComponent implements OnInit {
  roomsDataObject: RoomData = roomsData;

  stage!: Konva.Stage;
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
  selectedImage!: string;
  imageSrc!: string;
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
    // this.backgroundImage.on('click', () => {
    //   this.loadImage();
    // });
  }

  loadImage() {
    const image = new Image();
    image.src =this.getImagePath();

    image.onload = () => {
      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        width: image.width,
        height: image.height,
        draggable:true
      });

      const layer = new Konva.Layer();
      layer.add(konvaImage);
      const transformer = new Konva.Transformer({
        nodes: [konvaImage], // Add the image to the transformer

      });
      layer.on('dblclick',()=>{
        transformer.destroy();
      })
      layer.add(transformer);
      this.stage.add(layer);

      layer.draw();
    };
  }

  imageOptions = [
    { label: '4p meeting room', value: 'image1' },
    { label: '6p meeting room', value: 'image2' },
    { label: '8p meeting room', value: 'image3' },
    { label: '10p meeting room', value: 'image4' },
    { label: '12p meeting room', value: 'image5' },
    { label: '16p meeting room', value: 'image6' },
    { label: '20p meeting room', value: 'image7' },
    { label: '24p meeting room', value: 'image8' },
    { label: 'MD cabin', value: 'image9' },
    { label: 'server room', value: 'image10' },
    { label: '3p cabin', value: 'image11' },
  ];

  imageSources: { [key: string]: string } = {
    'image1': 'assets/images/rooms/4p meeting room.png',
    'image2': 'assets/images/rooms/6p meeting room.png',
    'image3': 'assets/images/rooms/8p meeting room.png',
    'image4': 'assets/images/rooms/10p meeting room.png',
    'image5': 'assets/images/rooms/12p meeting room.png',
    'image6': 'assets/images/rooms/16p meeting room.png',
    'image7': 'assets/images/rooms/20p meeting room.png',
    'image8': 'assets/images/rooms/24p meeting room.png',
    'image9': 'assets/images/rooms/MD cabin.png',
    'image10': 'assets/images/rooms/server room.png',
    'image11': 'assets/images/rooms/3p cabin.png',
  };

  getImagePath(): string {
    return this.imageSources[this.selectedImage];
  }

  //for Zooming REQUIRED
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
  //reset the zoom REQUIRED
  resetZoomAndPosition(): void {
    // Set the initial scale and position values as per your original configuration
    const initialScale = 1;
    const initialPosition = { x: 0, y: 0 };

    this.stage.scale({ x: initialScale, y: initialScale });
    this.stage.position(initialPosition);
    this.stage.batchDraw();
  }

  //drawing the seats of selected proposal REQUIRED
  drawTHeSeat(){
    this.proposalData.forEach(dataOfSeats=>{
      for (const seat of dataOfSeats.seatsData) {
        this.drawSeatsBetweenPoints(seat.start, seat.end,seat.seatPosition,dataOfSeats.seatSize, dataOfSeats.color, seat.first,dataOfSeats.clientName,dataOfSeats.totalNumberOfSeats);
      }
    })

  }
  drawSeatsBetweenPoints(start:any, end:any,seatPosition:any,seatSize:any,color:any, index:any, clientName:string,totalNumberOfSeats:number) {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
    const seatSizeWidth = seatSize[0].width; // Extract width from seatSize
    const seatSizeHeight = seatSize[0].height; // Extract height from seatSize
    if(seatPosition==false){
      for (let x = startX; x < endX; x += seatSizeHeight) {
        for (let y = startY; y < endY; y += seatSizeWidth) {
          this.drawSeatRectangle(x, y,color,seatSizeWidth,seatSizeHeight,index,clientName,totalNumberOfSeats);
        }
      }
    }else{
      for (let x = startX; x < endX; x += seatSizeWidth) {
        for (let y = startY; y < endY; y += seatSizeHeight) {
          this.drawSeatRectangle(x, y,color,seatSizeHeight,seatSizeWidth,index,clientName,totalNumberOfSeats);
        }
      }
    }

  }

  drawSeatRectangle(x:any, y:any, fill:string, height:number, width:number, index:any, clientName:string,totalNumberOfSeats:number) {

    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: 'transparent',
      // stroke:'black',
      // strokeWidth:0.3,
      opacity: 0.5,
      name: 'seat-rectangle',
      draggable:true
    });
    this.layer.add(rect);
  }

  sepratedContent:any[]=[]
  selectedRoom:any;
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
  console.log("YEP",this.sepratedContent);


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
          color: jsonData.color,
        };

        // Add the common object to the array
        commonObjectsWithCounts.push(commonObject);
      }
    }
  }

  // Now you have an array commonObjectsWithCounts containing common objects
  console.log(commonObjectsWithCounts);
  this.showDataInHml=commonObjectsWithCounts
  this.assignRoomsToSeats(commonObjectsWithCounts)
    }



    assignRoomsToSeats(commonObjectsWithCounts: any[]) {
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
            seat.on('dblclick', (e:any) => {
              console.log(e,"dobule clicked")
              // Select all seat-rectangles with the same fill color
              let colorOfRect = e.target.attrs.fill;
              const seatsWithSameColor = seatRectangles.filter((s: any) => colorOfRect===s.fill());
                console.log(seatsWithSameColor)
              if (seatsWithSameColor.length > 1) {
                // Create a group for draggable seats
                // Add seats to the group
                seatsWithSameColor.forEach((s: any) => {
                  group.add(s);
                });

                // Add the group to the layer
                this.layer.add(group);

                // Redraw the layer to apply the changes
                this.layer.batchDraw();
              }
            });

          } else {
            break; // No more seats available for this room
          }
          currentSeatIndex++;
        }
        if (roomSeats.length > 1) {
          group.on('dragmove', () => {
            // Synchronize the positions of all seats in the group
            roomSeats.forEach((seat: any) => {
              seat.x(group.x());
              seat.y(group.y());
            });
            this.layer.batchDraw(); // Redraw the layer to apply the changes
          });

          // Add the group to the layer
          this.layer.add(group);
        }
        // You can do something with roomSeats (e.g., save them in a data structure)
      });

      // Redraw the layer to apply the changes to seat colors
      this.layer.batchDraw();
    }



}
