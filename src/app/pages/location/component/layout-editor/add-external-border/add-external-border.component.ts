import { Component, OnInit} from "@angular/core";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-external-border',
  templateUrl: './add-external-border.component.html',
  styleUrls: ['./add-external-border.component.scss']
})
export class AddExternalBorderComponent implements OnInit {
  id!: string;
  flowOfDrawingSeats:string = 'vertical';
  imageUrl:any;
  stage!: Konva.Stage;
  layer!: Konva.Layer;

  customWidth = 1080;
  customHeight = 734;
  backgroundImage!: Konva.Image;
  transformer!: Konva.Transformer;
  getAllPoints:any[]=[]
  totalNumber!:number;
seatSizeWidth!: number;
seatSizeHeight!: number;
setButtonDisable: boolean= false;
seatWidth!: number;
  seatHeight!: number;
  constructor(private locationService:LocationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
  }
  ngAfterViewInit(): void {
    this.getInitialViewLayout()
   }
   drawRect:any;
   getInitialViewLayout = () =>{
     this.locationService.getImageById(this.id).subscribe(
       (imageUrl) => {
         this.imageUrl = environment.baseUrl+'images/' + imageUrl;
         // console.log(this.imageUrl);
         const imageObj = new Image();
     imageObj.onload = () => {
       this.initializeKonva(imageObj);
       this.enableZoom(); // Add this line to enable zoom
       // this.enablePanning(); // Add this line to enable panning
       this.transformer = new Konva.Transformer(); // Initialize transformer
       this.layer.add(this.transformer);
     };

     imageObj.src = this.imageUrl;
       },
       error => {
         console.error('Error loading image data:', error);
         // Handle the error as needed
       }
     );

   }
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
  resetZoomAndPosition(): void {
    // Set the initial scale and position values as per your original configuration
    const initialScale = 1;
    const initialPosition = { x: 0, y: 0 };

    this.stage.scale({ x: initialScale, y: initialScale });
    this.stage.position(initialPosition);
    this.stage.batchDraw();
  }
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
       name:'bgImage'
     });

     this.layer.add(this.backgroundImage);
     this.layer.draw()

   }
//OPTIONS FOR SELECTION
// Define an array of option objects
areaOptions:any[] = [
  { value: 'stairs', color: 'brown', label: 'Stairs' },
  { value: 'space', color: 'green', label: 'Space' },
  { value: 'bathroom', color: 'orange', label: 'Bathroom' },
  { value: 'pantry', color: 'red', label: 'Pantry' },
  { value: 'workspace', color: 'blue', label: 'Workspace' },
  { value: 'pillars', color: 'gray', label: 'Pillars' },
];

   //draw rect
   isDrawingEnabled = false;
   shape!: Konva.Rect;
   isDrawing: boolean = false;
   startPoint: any | { x: number; y: number };
   timesofRectDrawn=0
  updatedX:any;
  updatedY:any;
  updatedWidth:any;
  updatedHeight:any
  selectedArea!: string; // Store the selected area
  selectedColor!: string; // Default color
  onAreaChange() {
    // Find the selected option in areaOptions
    const selectedOption = this.areaOptions.find(option => option.value === this.selectedArea);

    // Update the selected color based on the selected option's color or use a default color
    this.selectedColor = selectedOption ? selectedOption.color : 'blue';
  }

  toggleDrawing(): void {
    this.isDrawingEnabled = !this.isDrawingEnabled;
    this.startDrawingRect();
    if (!this.isDrawingEnabled) {
      this.isDrawing = false; // Stop ongoing drawing if disabled
    }
  }

   startDrawingRect() {
    this.stage.on('mousedown', this.handleMouseDown.bind(this));
    this.stage.on('mousemove', this.handleMouseMove.bind(this));
    this.stage.on('mouseup', this.handleMouseUp.bind(this));

  }
  transformNewShape:any
  handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void {

    if (this.isDrawingEnabled) {
      this.timesofRectDrawn++;
      const pos: any = this.stage.getPointerPosition();
      this.startPoint = pos;
      this.isDrawing = true;

      this.shape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: this.selectedColor,
        opacity: 0.6,
        stroke: 'black',
        strokeWidth: 0.2
      });


      this.layer.add(this.shape);

      this.layer.batchDraw()

      this.shape.on('mousedown', () => {
        this.transformNewShape = new Konva.Transformer();
        this.layer.add(this.transformNewShape);
        this.transformNewShape.nodes([this.shape]);
        this.shape.on('transformend', () => {
          this.updatedX = this.shape.x();
          this.updatedY = this.shape.y();
          this.updatedWidth = this.shape.width() * this.shape.scaleX();
          this.updatedHeight = this.shape.height() * this.shape.scaleY();
        });
      });

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
      // if (this.transformer) {
      //   this.transformer.attachTo(this.shape); // Reattach transformer
      // }
      this.isDrawingEnabled=!this.isDrawingEnabled

    }
  }

    addRectDataInArray() {
      this.transformNewShape.destroy()
      let seatpostio:boolean=true;
      const rect = {
        _id: Date.now(),
        startX: this.updatedX,
        startY: this.updatedY,
        endX: this.updatedX + this.updatedWidth,
        endY: this.updatedY + this.updatedHeight,
        rectWidth: this.updatedWidth,
        rectHeight: this.updatedHeight,
        seatHeight: this.seatHeight,
        seatWidth: this.seatWidth,
        seatPosition: seatpostio, // Default value is set to true
      };
      this.layer.draw()
      // Push the new rectangle into the getAllPoints array
      this.getAllPoints.push(rect);
      // console.log(this.getAllPoints);
      // this.shape.destroy()
      this.isDrawingEnabled = !this.isDrawingEnabled;
    }


    addLayout(){
      let data = {
          LayoutData:{layoutBorder:this.getAllPoints}
             }
// console.log(data)
      // this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      //   console.log(res);
        // this.router.navigate(['/admin','location','location-list'])
      // })
    }
    removeImage(){
     this.backgroundImage.destroy();
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

}
