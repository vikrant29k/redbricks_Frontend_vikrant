import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';
import { LocationService } from 'src/app/service/location/location.service';
@Component({
  selector: 'app-layout-editor',
  templateUrl: './layout-editor.component.html',
  styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit, AfterViewInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
  selectedShape!: Konva.Shape;
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
  isDeleteShape: boolean =false;
  allSelectedLayout: any;
  selectedIdOfLayout: any;
  constructor(private router: Router,
               private route: ActivatedRoute,
               private locationService: LocationService
             ) {}
  id!: string;
  imageUrl:any;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
   
    // console.log(this.id,"HELOOOOOOOOOOOOOOo")
  }
  ngAfterViewInit(): void {
   this.getInitialViewLayout()    
  }
  getInitialViewLayout = () =>{
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
        }else
        {
          this.allSelectedLayout = res
          this.seatSizeHeight=res.layoutArray[0].seatSize[0].height;
          this.seatSizeWidth=res.layoutArray[0].seatSize[0].width;
          this.seatHeight=this.seatSizeHeight;
          this.seatWidth=this.seatSizeWidth;
          this.updateSeatsSize()
          res.layoutArray[0].layoutBorder.forEach((item:any) => {
            const {_id, startX, startY, endX, endY, shape } = item;
            this.getAllPoints.push({_id, startX, startY, endX, endY, shape });
            // console.log("ARRAY DATAAAAAA--",this.getAllPoints,this.seatSizeHeight,this.seatSizeWidth)
          });
          // this.layer.clearBeforeDraw
            for (const layoutBorderObj of res.shapes) {

              const shape  = layoutBorderObj.attrs
       
              this.seatShape = new Konva.Rect({
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
  
              this.layer.add(this.seatShape);
              
      }
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
  startDrawingSeat() {
    this.stage.on('mousedown', this.handleMouseDownForSeat.bind(this));
    this.stage.on('mousemove', this.handleMouseMoveForSeat.bind(this));
    this.stage.on('mouseup', this.handleMouseUpForSeat.bind(this));
  }
  startDrawingRect() {
    this.stage.on('mousedown', this.handleMouseDown.bind(this));
    this.stage.on('mousemove', this.handleMouseMove.bind(this));
    this.stage.on('mouseup', this.handleMouseUp.bind(this));
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

  isDrawingEnabled = false;
  transformer!: Konva.Transformer;
  toggleDrawing(): void {
    this.isDrawingEnabled = !this.isDrawingEnabled;
    this.startDrawingRect();
    if (!this.isDrawingEnabled) {
      this.isDrawing = false; // Stop ongoing drawing if disabled
    }
  }
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
  this.isDrawingEnabled=!this.isDrawingEnabled
}
  seatDrawing: boolean = false;
  isSeatDrawingEnabled = false;
  drawSeatAndGetHW() {
    // this.isSeatDrawingInProgress = false;
    this.isSeatDrawingEnabled = !this.isSeatDrawingEnabled;
    this.startDrawingSeat();
    if (!this.isSeatDrawingEnabled) {
      this.seatDrawing = false; // Stop ongoing drawing if disabled
    }
  }
  

  seatDrawn = 0;

  handleMouseDownForSeat(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isSeatDrawingEnabled && this.seatDrawn == 0) {
      const pos: any = this.stage.getPointerPosition();
      this.startPoint = pos;
      this.seatDrawing = true;
      //  this.isSeatDrawingInProgress = true;
      this.seatShape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: 'red',
        opacity: 0.3,
        stroke: '#000000',
        strokeWidth: 0.3,
        draggable: true,
        name: 'seat-layer',
      });

      const transformer = new Konva.Transformer({
        name:'seat-transform'
      });
      transformer.on('transform', () => {
        const scaleX = this.seatShape.scaleX();
        const scaleY = this.seatShape.scaleY();
        const newWidth = this.seatShape.width() * scaleX;
        const newHeight = this.seatShape.height() * scaleY;
        this.seatShape.width(newWidth);
        this.seatShape.height(newHeight);
        if (this.isSeatDrawingEnabled) {
          this.seatHeight = Number(newHeight.toFixed(2));
          this.seatWidth = Number(newWidth.toFixed(2));
        }
        this.layer.batchDraw();
      });

      this.layer.add(this.seatShape, transformer);
      transformer.attachTo(this.seatShape);
    } else {
      // console.log('MouseDown: Drawing is disabled Seat');
    }
  }

  handleMouseMoveForSeat(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isSeatDrawingEnabled && this.seatDrawn == 0 && this.seatDrawing) {
      const pos: any = this.stage.getPointerPosition();
      const width = pos.x - this.startPoint.x;
      const height = pos.y - this.startPoint.y;

      this.seatShape.width(width);
      this.seatShape.height(height);

      this.layer.batchDraw();
    }
  }

  handleMouseUpForSeat(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.isSeatDrawingEnabled && this.seatDrawn === 0 && this.seatDrawing) {
      this.seatDrawing = false;
      //  this.isSeatDrawingInProgress = false;
      const rect = {
        startX: this.seatShape.attrs.x,
        startY: this.seatShape.attrs.y,
        endX: this.seatShape.attrs.x + this.seatShape.attrs.width,
        endY: this.seatShape.attrs.y + this.seatShape.attrs.height,
        shape: this.seatShape,
        // xPercentage: this.shape.attrs.x/ this.customWidth,
        // yPercentage: this.shape.attrs.y/ this.customHeight,
        // widthPercentage: this.shape.attrs.width / this.customWidth,
        // heightPercentage:this.shape.attrs.height / this.customHeight
      };
      this.seatDrawn = 1;
      // this.getHeightWidthOfSeat();
    } else {
    }
  }
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
      console.log(res);
      this.router.navigate(['/admin','location','location-list'])
    })
  }
 
  

 
  eventEmitDoubleClick(event:MouseEvent){
this.stage.on('dblclick',(e)=>{
  this.transformer.destroy()
  console.log(e.evt.offsetX,e.evt.offsetY,"selectpoint of stage")
  for(let el of this.allSelectedLayout.layoutArray[0].layoutBorder){
              if(((e.evt.offsetX<=el.endX && e.evt.offsetX >= el.startX))&& ((e.evt.offsetY<=el.endY && e.evt.offsetY >= el.startY))){
                let index=this.allSelectedLayout.layoutArray[0].layoutBorder.indexOf(el)
                this.selectedIdOfLayout =el._id
                this.isDeleteShape = true
                this.allSelectedLayout.shapes[index]
            this.transformer = new Konva.Transformer();
              this.layer.add(this.transformer)
        this.stage.add(this.layer);
        // Create and add shapes to the layer
        const rect = new Konva.Rect(this.allSelectedLayout.shapes[index].attrs);
          this.selectedShape 
        rect.on('click', () => {
          this.selectShape(rect);
        });
        this.transformer.attachTo(rect);
              }
            }
})
  }
  
  
  selectShape(shape: Konva.Shape): void {
    if (this.selectedShape) {
      this.selectedShape.stroke();
    }
    this.selectedShape = shape;
    this.layer.draw();
  }
  
  deleteSelectedShape(seatShape:Rect): void {
      for(let el of this.getAllPoints){
        if(el._id === this.selectedIdOfLayout) {
        let index = this.getAllPoints.indexOf(el)
        this.getAllPoints.splice(index,1);
        this.transformer.destroy()
        let data = { 
          LayoutData:{layoutBorder:this.getAllPoints,
               seatSize:this.seatArray}
             }
      
      this.locationService.addLayoutData(this.id,data).subscribe(res=>{
        this.getInitialViewLayout()
      })
        }
      }

    
      this.isDeleteShape =false

  }
  
}
