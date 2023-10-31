import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { LocationService } from 'src/app/service/location/location.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-old-client',
  templateUrl: './add-old-client.component.html',
  styleUrls: ['./add-old-client.component.scss']
})
export class AddOldClientComponent implements OnInit {

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
  customWidth = 1080;
  customHeight = 734;
  getAllPoints: any[] = [];
  flowOfDrawingSeats: boolean = true;
  seatSizeWidth: any;
  seatSizeHeight: any;
  scrollerContainer!: HTMLDivElement;

  numRectangles!: number;
  imageName!: string;
  points: number[] = [];
  seatWidth: number = 0;
  seatHeight: number = 0;
  rectWidth: number = 0;
  rectHeight: number = 0;
  shape!: Konva.Rect;
  seatShape!: Konva.Rect;
  startPoint: any | { x: number; y: number };
  isDrawing: boolean = false;
  constructor(private router: Router,
               private route: ActivatedRoute,
               private proposalService:ProposalService,
               private locationService: LocationService,
               private dashboardService: DashboardService
             ) {}
  id!: string;
  imageUrl:any;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
    this.watchValueChangesInForm();
    this.getLocationList();
    this.getSalesPersonList();

  }
ngAfterViewInit():void{

}

  clientForm = new FormGroup<any>({
    clientName:new FormControl('',Validators.required),
    location: new FormControl('', Validators.required),
    locationId:new FormControl('',Validators.required),
    floor: new FormControl('', Validators.required),
    finalOfferAmmount: new FormControl('', Validators.required),
    salesPerson: new FormControl('', Validators.required),
    Tenure: new FormControl('', Validators.required),
    LockIn: new FormControl('', Validators.required),
    depoistTerm: new FormControl('', Validators.required),
    center: new FormControl('', Validators.required),
    noticePeriod:new FormControl('', Validators.required),
    rentCommencmentDate: new FormControl('', Validators.required),
    NonStandardRequirement: new FormControl('', Validators.required),
    Serviced:new FormControl('',Validators.required),
    totalNumberOfSeats: new FormControl('',Validators.required),
    status:new FormControl('',Validators.required),
    seatsData:new FormControl('',Validators.required),
    seatSize:new FormControl('',Validators.required),
    color:new FormControl('',Validators.required),
  })


onSubmit(){
  this.clientForm.patchValue({
    seatsData:this.drawnSeats,
    seatSize:[{
      height: this.seatSizeHeight,
      width:this.seatSizeWidth
     }],
     status:'Completed and Locked',
     locationId:this.locationId
  })
  // console.log(this.clientForm.value)
  this.proposalService.addOldClient(this.clientForm.value).subscribe(res=>{
    this.router.navigate(['/admin', 'old-proposal', 'old-client-list']);
  })

}

//Get Location List
locationList:any[]=[]
centerList:any[]=[]
floorList:any[]=[]
locationId!:string
salesPersons:any[]=[]
//getSalesperson list
getSalesPersonList(){
  this.dashboardService.getUserData().subscribe((res:any)=>{
    for (const person of res) {
      const { firstName, lastName } = person;
      // Create an object with extracted data and push it into the array
      this.salesPersons.push({ firstName, lastName });
  }
  })

}
//gets the all location
getLocationList(){
  this.locationService.getLocationList().subscribe((res:any)=>{
this.locationList=res
  })
}
//get the center list after selecting location
getCenterList(location: string) {
  this.locationService.getCentersInLocation(location).subscribe((res:any) => {
    this.centerList = [];
    for (const center of res) {
      this.centerList.push(center.center);
    }
  });
}
// get the floors after center selected
getFloorList(location: string) {
  this.locationService.getFloorsInLocation(location).subscribe((res:any) => {
    this.floorList = []
    for (const center of res) {
      this.floorList.push({
        center:center.floor,
        _id:center._id
        });
    }
    // this.clientForm.addControl('floor',new FormControl('', Validators.required));
  });
}
showContainer:boolean=false
getLocationIdFromFloor(id:string){
  // console.log(id,"I am lcoation id")
  this.locationId=id;
  this.locationService.getImageById(id).subscribe(
    (imageUrl) => {
      this.imageUrl = environment.baseUrl+'images/' + imageUrl;
      // console.log(this.imageUrl);
      const imageObj = new Image();
  imageObj.onload = () => {
    this.initializeKonva(imageObj);
    // this.enableZoom(); // Add this line to enable zoom
    this.transformer = new Konva.Transformer(); // Initialize transformer
    this.layer.add(this.transformer);
    this.locationService.getBorderData(id).subscribe((res:any)=>{
      // console.log(res);
      if(res.Message==='No data'){
        // console.log("NO DATAA")
      }else{
        this.seatWidth=res.layoutArray[0].seatWidth;
        this.seatHeight=res.layoutArray[0].seatHeight;
        // console.log("HY DATA ")
        this.totalNumber=res.totalNoOfWorkstation
        res.layoutArray[0].layoutBorder.forEach((item:any) => {
          const {_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition } = item;
          this.getAllPoints.push({_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition });

        });
        // this.layer.clearBeforeDraw
          for (const shape of res.layoutArray[0].layoutBorder) {
            const rect = new Konva.Rect({
              x: shape.startX,
              y: shape.startY,
              width: shape.rectWidth,
              height: shape.rectHeight,
              fill: 'transparent',
              opacity: 0.05,
            });

            this.layer.add(rect)
          }
          this.layer.batchDraw()
        this.updateSeatsSize()
      }

    })
  };

  imageObj.src = this.imageUrl;
    },
    error => {
      console.error('Error loading image data:', error);
      // Handle the error as needed
    }
  );
}

changeTheFlow(){
  this.flowOfDrawingSeats=!this.flowOfDrawingSeats
}
watchValueChangesInForm = () => {

  let location = this.clientForm.get('location');
  location?.valueChanges.subscribe((res) => {
    this.getCenterList(res);
  });
  let center = this.clientForm.get('center');
  center?.valueChanges.subscribe(res=>{
    this.getFloorList(res)
  })
  let floor = this.clientForm.get('floor');
  floor?.valueChanges.subscribe(res=>{
    if(res){
      this.showContainer=true
    }
  })
};

backgroundImage!: Konva.Image;
//konva initialization
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

  startDrawingRect() {
    this.stage.on('mousedown', this.handleMouseDown.bind(this));
    this.stage.on('mousemove', this.handleMouseMove.bind(this));
    this.stage.on('mouseup', this.handleMouseUp.bind(this));
  }

  //zoomin and zoomout the image
  // enableZoom(): void {
  //   const scaleBy = 1.1; // Adjust the scale factor as needed
  //   this.stage.on('wheel', (e) => {
  //     e.evt.preventDefault();

  //     const oldScale = this.stage.scaleX();
  //     const pointer: any = this.stage.getPointerPosition();

  //     const mousePointTo = {
  //       x: (pointer.x - this.stage.x()) / oldScale,
  //       y: (pointer.y - this.stage.y()) / oldScale,
  //     };

  //     const direction = e.evt.deltaY > 0 ? -1 : 1; // Adjust the direction for standard zoom behavior

  //     const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  //     this.stage.scale({ x: newScale, y: newScale });

  //     const newPos = {
  //       x: pointer.x - mousePointTo.x * newScale,
  //       y: pointer.y - mousePointTo.y * newScale,
  //     };
  //     this.stage.position(newPos);
  //     this.stage.batchDraw();
  //   });
  // }
  // resetZoomAndPosition() {
  //   // Set the initial scale and position values as per your original configuration
  //   const initialScale = 1;
  //   const initialPosition = { x: 0, y: 0 };

  //   this.stage.scale({ x: initialScale, y: initialScale });
  //   this.stage.position(initialPosition);
  //   this.stage.batchDraw();
  // }

  isDrawingEnabled = false;
  transformer!: Konva.Transformer;
  toggleDrawing(): void {
    this.isDrawingEnabled = !this.isDrawingEnabled;
    this.startDrawingRect();
    if (!this.isDrawingEnabled) {
      this.isDrawing = false; // Stop ongoing drawing if disabled
    }
  }
  // starts drawing rect
  handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingEnabled) {
      const pos: any = this.stage.getPointerPosition();
      this.startPoint = pos;
      this.isDrawing = true;

      this.shape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: 'lightblue',
        opacity: 0.3,
        stroke: '#000000',
        strokeWidth: 0.8,
        name: 'workstation-layer',
      });

      const transformer = new Konva.Transformer();

      transformer.on('transform', () => {
        const scaleX = this.shape.scaleX();
        const scaleY = this.shape.scaleY();
        const newWidth = this.shape.width() * scaleX;
        const newHeight = this.shape.height() * scaleY;
        this.shape.width(newWidth);
        this.shape.height(newHeight);

        this.layer.batchDraw();
      });
      this.layer.add(this.shape,transformer);
      transformer.attachTo(this.shape);


      // this.layer.add(this.shape)

    }
  }

  handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingEnabled && this.isDrawing) {
      const pos: any = this.stage.getPointerPosition();
      const width = pos.x - this.startPoint.x;
      const height = pos.y - this.startPoint.y;
      // if (this.transformer) {
      //   this.transformer.detach(); // Detach transformer to avoid interference
      // }
      this.shape.width(width);
      this.shape.height(height);

      this.layer.batchDraw();
    }
  }

  handleMouseUp(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingEnabled && this.isDrawing) {
      this.isDrawing = false;
      this.isDrawingEnabled=!this.isDrawingEnabled

    }
  }
  //rect is added in this.getAllpoints
  addRectDataInArray(){
    const rect = {
      _id:Date.now(),
      startX: this.shape.attrs.x,
      startY: this.shape.attrs.y,
      endX: this.shape.attrs.x + this.shape.attrs.width,
      endY: this.shape.attrs.y + this.shape.attrs.height,
      shape: this.shape,
    };
    this.getAllPoints.push(rect)
    // console.log(this.getAllPoints);
    this.isDrawingEnabled=!this.isDrawingEnabled
  }

//get the seatSize and updates it
  updateSeatsSize() {
    this.seatSizeWidth = this.seatWidth;
    this.seatSizeHeight = this.seatHeight;
    // const rectanglesToRemove = this.layer.find('.seat-layer'); // Assuming you've given your rectangles a class name like 'seat-rectangle'
    // const transform = this.layer.find('.seat-transform')

    // rectanglesToRemove.forEach(rectangle => {
    //   rectangle.destroy(); // Remove the rectangle from the layer
    // });
    // transform.forEach(rectangle => {
    //   rectangle.destroy(); // Remove the rectangle from the layer
    // });
    // this.layer.batchDraw();
    // console.log(this.seatHeight,this.seatWidth)
  }

  totalNumber:any
  drawingEnabled: boolean = true;
  drawnSeats:any[]=[]
  lastCoordinate:any[]=[]
  totalNumebrOfSeat:any
  //onclick activates the function and when clicked in certain area the seats are drawn
  drawRectangles() {
    let count = 0;
    this.totalNumebrOfSeat = this.clientForm.get('totalNumberOfSeats')?.value
    this.stage.on('click', (e: any) => {
      const x = e.evt.offsetX; // X coordinate of the click
      const y = e.evt.offsetY; // Y coordinate of the click

    if (!this.stage || !this.layer) return;
    if (this.drawingEnabled === true) {
      let remainingSeats = this.totalNumebrOfSeat
      // console.log(remainingSeats)
      for (const point of this.getAllPoints) {

        const minX = point.startX;
        const minY = point.startY;
        const maxX = point.endX;
        const maxY = point.endY;

        const availableWidth = maxX - minX;
        const availableHeight = maxY - minY;
        const maxHorizontalRectangles = Math.floor(availableWidth / this.seatWidth);
        const maxVerticalRectangles = Math.floor(availableHeight / this.seatHeight);

        const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;
        const flowOfData = this.flowOfDrawingSeats;
        if (x < maxX && x > minX && y > minY && y < maxY) {
          const polygon = new Konva.Line({
            points: this.getAllPoints,
            fill: 'transparent',
            stroke: 'black',
            strokeWidth:0.3,
            // draggable:true,
          });
          this.layer.add(polygon);
        if (flowOfData == true) {
          const columns:number = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
          const seatWidth:number = point.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
            const seatHeight:number = point.seatPosition ? this.seatHeight :this.seatWidth;
          for (let column:number = 0; column < columns; column++) {
            for (let y:number = minY; y < maxY-10  ; y += seatHeight) {
              const x = minX + column * seatWidth;
              if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width:seatWidth, height: seatHeight }, polygon.getClientRect())) {
                this.drawSeatRectangle(x, y,seatHeight,seatWidth);
                this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + seatWidth, y: y + seatHeight },workStatkionID: point._id,seatPosition: point.seatPosition  });

                remainingSeats--;
                count++;

                // if(this.totalNumebrOfSeat==count){
                //   this.lastCoordinate.push({
                //     lastX:x+seatWidth,
                //     lastY:y+seatHeight
                //   })
                // }
              }
            }
          }
        }
        else {

          const rows = Math.min(Math.ceil(remainingSeats / maxHorizontalRectangles), maxVerticalRectangles);
          const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
          const seatHeight = point.seatPosition ? this.seatHeight :this.seatWidth;
          for (let row = 0; row < rows; row++) {
            for (let x = minX; x < maxX - 10; x += seatWidth) {
              const y = minY + row * seatHeight;

              if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: seatWidth, height: seatHeight }, polygon.getClientRect())) {
                this.drawSeatRectangle(x, y,seatHeight,seatWidth);
                this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + seatWidth, y: y + seatHeight },workStatkionID: point._id,seatPosition: point.seatPosition });

                remainingSeats--;
                count++;
                // if(this.totalNumebrOfSeat==count){
                //   this.lastCoordinate.push({
                //     lastX:x+seatWidth,
                //     lastY:y+seatHeight
                //   })
                // }
              }
            }
          }
        }
        this.totalNumebrOfSeat=remainingSeats;
        if (remainingSeats === 0) {
          this.drawingEnabled = false;
          break;
        }
      }

      this.layer.batchDraw();
    }
    }})
  }
  //seat rect draw fucntion
  drawSeatRectangle(x:number, y:number,height:number,width:number) {
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: 'blue',
      opacity: 0.3,
      stroke: 'red',
      strokeWidth: 0.4,
      name: 'seat-rectangle',
    });
    this.layer.add(rect);
    rect.cache() //for code optimization

  }
//function to remove the seat if selected and set the count again to its original count
// private drawnSeatsStack: any[] = [];
  resetSeat(){
    let selectedSeat:any = this.layer.find('.seat-rectangle')
   this.totalNumebrOfSeat = selectedSeat.length;
   this.drawingEnabled=true
   selectedSeat.forEach((data:any)=>{
    data.destroy()
   })
  }
}


