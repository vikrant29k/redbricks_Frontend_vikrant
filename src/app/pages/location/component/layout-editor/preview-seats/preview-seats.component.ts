import { Component, OnInit, Inject,AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-preview-seats',
  templateUrl: './preview-seats.component.html',
  styleUrls: ['./preview-seats.component.scss']
})
export class PreviewSeatsComponent implements OnInit {
  id!: string;
  flowOfDrawingSeats:string = 'vertical';
  imageUrl:any;
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
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
       this.locationService.getBorderData(this.id).subscribe((res:any)=>{
         // console.log(res);
         if(res.Message==='No data'){
           console.log("NO DATAA")
         }else
         {
           // this.allSelectedLayout = res
           // this.seatSizeHeight=res.layoutArray[0].seatSize[0].height;
           // this.seatSizeWidth=res.layoutArray[0].seatSize[0].width;
           // this.seatHeight=this.seatSizeHeight;
           // this.seatWidth=this.seatSizeWidth;
           // this.updateSeatsSize()
           console.log("NO DATAA")
           this.totalNumber=res.totalNoOfWorkstation
           res.layoutArray[0].layoutBorder.forEach((item:any) => {
             const {_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight } = item;
             this.getAllPoints.push({_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight });
             this.seatWidth=seatWidth;
             this.seatHeight=seatHeight;
           });
           // this.layer.clearBeforeDraw
             for (const shape of res.layoutArray[0].layoutBorder) {
              const rect = new Konva.Rect({
                 x: shape.startX,
                 y: shape.startY,
                 width: shape.rectWidth,
                 height: shape.rectHeight,
                 fill: 'blue',
                 opacity: 0.3,
                   draggable: false,
                   name:shape._id
               });

               this.layer.add(rect);

               rect.on('mousedown',()=>{
                 let transformNew = new Konva.Transformer()
               this.layer.add(transformNew);
               transformNew.nodes([rect])
                 this.transformer=transformNew
                 console.log("FIRST BEFORE",rect)
               rect.on('transformend', () => {
                 // if (this.selectedShape) {
                   // console.log('RECT NAME',rect.attrs())
                   const updatedWidth = rect.width() * rect.scaleX();
                   const updatedHeight = rect.height() * rect.scaleY();
                   const updatedX = rect.x();
                   const updatedY = rect.y();
                   const indexToUpdate = this.getAllPoints.findIndex((point) => point._id === rect.name());

                   if (indexToUpdate !== -1) {
                     // Update the object at the found index
                     this.getAllPoints[indexToUpdate] = {
                       ...this.getAllPoints[indexToUpdate], // Copy existing properties
                       startX: updatedX,
                       startY: updatedY,
                       rectWidth: updatedWidth,
                       rectHeight: updatedHeight,
                       endX: updatedX + updatedWidth,
                       endY: updatedY + updatedHeight,
                     };

                     console.log("AFTER UPDATE", this.getAllPoints[indexToUpdate]);
                   }

               });
               })


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
     });

     this.layer.add(this.backgroundImage);
     this.layer.draw();
     this.drawRectangles()
   }
     //drawSeats
     drawingEnabled: boolean = true;
     lastCoordinate:any[]=[]
     drawnSeats:any[]=[]
     drawRectangles() {
      let count = 0;
      if (!this.stage || !this.layer) return;
      if (this.drawingEnabled === true) {
        let remainingSeats = this.totalNumber;

        for (const point of this.getAllPoints) {
          const minX = point.startX;
          const minY = point.startY;
          const maxX = point.endX;
          const maxY = point.endY;
          console.log("name of rect",point._id,
          // "\n minX=",point.startX,
          // "\n maxX=>",point.endX,
          "\n width of rect=>", point.endX-point.startX);
console.log("MAX Columns can be added==>",Math.round((maxX-minX)/point.seatWidth))
this.seatSizeHeight=point.seatHeight;
this.seatSizeWidth=point.seatWidth;
const availableWidth = maxX - minX;
const availableHeight = maxY - minY;
const maxHorizontalRectangles = Math.floor(availableWidth / point.seatWidth);
const maxVerticalRectangles = Math.floor(availableHeight / point.seatHeight);

const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;
          const polygon = new Konva.Line({
            points: this.getAllPoints,
            fill: 'transparent',
            stroke: 'black',
            strokeWidth: 0.3,
          });
          this.layer.add(polygon);

          if (this.flowOfDrawingSeats == 'vertical') {
            const columns = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
            for (let column = 0; column < columns; column++) {
              for (let y = minY; y < maxY - 10; y += point.seatHeight) {
                const x = minX + column * point.seatWidth;

                if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: point.seatWidth, height: point.seatHeight }, polygon.getClientRect())) {
                  this.drawSeatRectangle(x, y, point.seatHeight, point.seatWidth);
                  remainingSeats--;
                  count++;
                }
              }
            }
          }
          this.totalNumber = remainingSeats;
          if (remainingSeats === 0) {
            this.drawingEnabled = false;
            break;
          }
        }

        // Trigger rendering
        this.layer.draw();
      }
    }


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
     }

     addLayout(){
      let data = {
          LayoutData:{layoutBorder:this.getAllPoints}
             }

      this.locationService.addLayoutData(this.id,data).subscribe(res=>{
        console.log(res);
        this.router.navigate(['/admin','location','location-list'])
      })
    }
}
