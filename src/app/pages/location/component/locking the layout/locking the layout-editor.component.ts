import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { LocationService } from 'src/app/service/location/location.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
@Component({
  selector: 'app-lock-layout-editor',
  templateUrl: './locking the layout-editor.component.html',
  styleUrls: ['./locking the layout-editor.component.scss'],
})
export class LockLayoutEditorComponent implements OnInit, AfterViewInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
  customWidth = 800;
  customHeight = 566;
  getAllPoints: any[] = [];
  flowOfDrawingSeats: string = 'vertical';
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
  shape!: Konva.Rect; // Use Rect instead of Line
  seatShape!: Konva.Rect;
  startPoint: any | { x: number; y: number };
  isDrawing: boolean = false;
  constructor(private router: Router,
               private route: ActivatedRoute,
               private locationService: LocationService,
               private proposalService:ProposalService
             ) {}
  id!: string;
  imageUrl:any;
  proposalId!:string
  drawnSeats:any[]=[];
  ngOnInit(): void {
    this.proposalId = this.route.snapshot.params['proposalId'];

  }
  ngAfterViewInit(): void {
    this.proposalService.getProposalById(this.proposalId).subscribe((res:any)=>{
      // console.log(res)
      this.id=res[0].locationId
      this.drawnSeats=res[0].seatsData
  //  this.drawnSeats=res[0].seatsData
  this.seatSizeHeight=res[0].seatSize[0].height;
  this.seatSizeWidth=res[0].seatSize[0].width;
    this.locationService.getImageById(this.id).subscribe(
      (imageUrl) => {
        this.imageUrl = 'http://192.168.29.233:3000/images/' + imageUrl;
        console.log(this.imageUrl);
        const imageObj = new Image();
    imageObj.onload = () => {
      this.initializeKonva(imageObj);
      this.enableZoom(); // Add this line to enable zoom
      // this.enablePanning(); // Add this line to enable panning
      this.transformer = new Konva.Transformer(); // Initialize transformer
      this.layer.add(this.transformer);
      this.locationService.getBorderData(this.id).subscribe((res:any)=>{
        // console.log(res);
        if(res.Message==='No data'){
          console.log("NO DATAA")
        }else{
          res.layoutArray.forEach((item:any) => {
            const { startX, startY, endX, endY, shape } = item;
            this.getAllPoints.push({ startX, startY, endX, endY, shape });
            for (const layoutBorderObj of res.shapes) {

              const shape  = layoutBorderObj.attrs
       
              const rect = new Konva.Rect({
                  x: shape.x,
                  y: shape.y,
                  width: shape.width,
                  height: shape.height,
                  fill: shape.fill,
                  opacity: shape.opacity,
                  stroke: shape.stroke,
                  strokeWidth: shape.strokeWidth,
                  name: shape.name,
                  draggable: false // Set draggable as needed
              });
  
              this.layer.add(rect);
              
      }
        });
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

  })
  }
  drawTHeSeat(){
    for (const seat of this.drawnSeats) {
      this.drawSeatsBetweenPoints(seat.start, seat.end);
    }
  }
  drawSeatsBetweenPoints(start:any, end:any) {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
  
    for (let x = startX; x < endX; x += this.seatSizeWidth) {
      for (let y = startY; y < endY; y += this.seatSizeHeight) {
        this.drawSeatRectangle(x, y);
      }
    }
  }
  drawSeatRectangle(x:any, y:any) {
    console.log(x,y)
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: this.seatSizeWidth,
      height: this.seatSizeHeight,
      fill: 'red',
      opacity: 0.5,
      stroke: 'red',
      strokeWidth: 0.4,
      name: 'seat-rectangle',
    });
    this.layer.add(rect);
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
  }

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

  transformer!: Konva.Transformer;
 
  updateGetAllPointsAfterTransformation(): void {
    // Find the index of the shape in getAllPoints based on the shape instance
    const index = this.getAllPoints.findIndex(
      (point) => point.shape === this.shape
    );

    if (index !== -1) {
      // Update the corresponding rectangle in getAllPoints with new dimensions
      this.getAllPoints[index] = {
        ...this.getAllPoints[index],
        startX: this.shape.attrs.x,
        startY: this.shape.attrs.y,
        endX: this.shape.attrs.x + this.shape.attrs.width,
        endY: this.shape.attrs.y + this.shape.attrs.height,
        shape: this.shape,
      };

      console.log('Updated getAllPoints:', this.getAllPoints);
    }
  }
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
  console.log(this.getAllPoints);
  const rectBorder=this.layer.find('.rect-transform');
  rectBorder.forEach(rectangle => {
    rectangle.destroy(); // Remove the rectangle from the layer
  });

}
  seatDrawing: boolean = false;
  isSeatDrawingEnabled = false;
 
seatArray:any[]=[]
  updateSeatsSize() {
    this.seatSizeWidth = this.seatWidth;
    this.seatSizeHeight = this.seatHeight;
    const rectanglesToRemove = this.layer.find('.seat-layer'); // Assuming you've given your rectangles a class name like 'seat-rectangle'
    const transform = this.layer.find('.seat-transform')
   
    rectanglesToRemove.forEach(rectangle => {
      rectangle.destroy(); // Remove the rectangle from the layer
    });
    transform.forEach(rectangle => {
      rectangle.destroy(); // Remove the rectangle from the layer
    });
    this.layer.batchDraw();
    this.seatArray=[{
      width:this.seatWidth,
      height:this.seatHeight
    }]
    console.log(this.seatHeight,this.seatWidth)

  }

  addLayout(){
    let data = { 
        LayoutData:{layoutBorder:this.getAllPoints,
             seatSize:this.seatArray}
           }
    
    this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      console.log(res)
    })
  }

  displayRectangles() {
    this.drawTHeSeat()
    // Find all rectangles with the attribute name 'workstation-layer'
    const workstationRectangles = this.layer.find('.workstation-layer');
  
    // Make each found rectangle draggable and transformable
    workstationRectangles.forEach(rectangle => {
      rectangle.draggable(true);
      // console.log(rectangle)
      // Create a transformer for each rectangle and attach it
      const transformer = new Konva.Transformer();
     
      transformer.on('transform', () => {
        const scaleX = rectangle.scaleX();
        const scaleY = rectangle.scaleY();
        const newWidth = rectangle.width() * scaleX;
        const newHeight = rectangle.height() * scaleY;
        rectangle.width(newWidth);
        rectangle.height(newHeight);
     
        this.layer.batchDraw();
      });
      this.layer.add(transformer);
      transformer.attachTo(rectangle);
    
    });
  
    // Redraw the layer to reflect the changes
    this.layer.batchDraw();
  }
  updateStoredValues() {
    // Find all rectangles with the attribute name 'workstation-layer'
    this.getAllPoints=[]
    const workstationRectangles = this.layer.find('.workstation-layer');
  
    // Update the stored values for each transformed rectangle
    workstationRectangles.forEach(rectangle => {
      if(!rectangle){
        console.log('NULL')
      }else{
        const name = rectangle.name();
        const x = rectangle.x();
        const y = rectangle.y();
        const width = rectangle.width();
        const height = rectangle.height();
        
      // console.log('Updated stored values:', rectangle);
      const rect = {
        _id:Date.now(),
        startX: rectangle.x(),
        startY: rectangle.y(),
        endX: rectangle.x() +  rectangle.width(),
        endY: rectangle.y() +  rectangle.height(),
        shape: rectangle,
      };
      this.getAllPoints.push(rect)
      }
     
    
    });
  
    console.log(this.getAllPoints);
    this.seatArray=[{
      width:this.seatSizeWidth,
      height:this.seatSizeHeight
    }]
    let data = { 
      LayoutData:{layoutBorder:this.getAllPoints,
           seatSize:this.seatArray}
         }
        
  this.locationService.addLayoutData(this.id,data).subscribe(res=>{
    console.log(res);
    this.proposalService.lockProposal(this.proposalId, { lockProposal:true })
          .subscribe((res:any) => {
            console.log(res,"Locked Proposal")
          });
    this.router.navigate(['/admin','location','location-list'])
  })
    
  }

    //creating locked seats.....
  isDrawingLockEnabled = false;
  isLockDrawing=true
  lockedshape!: Konva.Rect;
  lockstartPoint!:{ x: number; y: number };
  toggleLockDrawing(): void {
    this.isDrawingLockEnabled = !this.isDrawingLockEnabled;
    this.startDrawingLOCKRect();
    if (!this.isDrawingLockEnabled) {
      this.isLockDrawing = false; // Stop ongoing drawing if disabled
    }
  }
  startDrawingLOCKRect() {
    this.stage.on('mousedown', this.handleMouseLOCKDown.bind(this));
    this.stage.on('mousemove', this.handleMouseLOCKMove.bind(this));
    this.stage.on('mouseup', this.handleMouseLOCKUp.bind(this));
  }
    handleMouseLOCKDown(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingLockEnabled) {
      const pos: any = this.stage.getPointerPosition();
      this.lockstartPoint = pos;
      this.isLockDrawing = true;

      this.lockedshape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: 'red',
        opacity: 0.3,
        stroke: '#000000',
        strokeWidth: 0.8,
        name: 'locked-layer',
      });
     
      this.layer.add(this.lockedshape)
    } 
  }

  handleMouseLOCKMove(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingLockEnabled && this.isLockDrawing) {
      const pos: any = this.stage.getPointerPosition();
      const width = pos.x - this.lockstartPoint.x;
      const height = pos.y - this.lockstartPoint.y;
      this.lockedshape.width(width);
      this.lockedshape.height(height);

      this.layer.batchDraw();
    }
  }

  handleMouseLOCKUp(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isDrawingLockEnabled && this.isLockDrawing) {
      this.isLockDrawing = false;
     
    }
    console.log(this.lockedshape,"SHAPE OF LOCKED")
  }
  
}
