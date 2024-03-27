import { Component, OnInit} from "@angular/core";
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
  // layer!: Konva.Layer;
  line!: Konva.Line;
  customWidth = 1080;
  customHeight = 734;
  backgroundImage!: Konva.Image;
  transformer!: Konva.Transformer;
  getAllPoints:any[]=[]
  totalNumber!:number;
setButtonDisable: boolean= false;
seatWidth!: number;
  seatHeight!: number;

  pillarData:any[]=[]

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
       this.seatLayer.add(this.transformer);
       this.locationService.getBorderData(this.id).subscribe((res:any)=>{
         // console.log(res);
         if(res.Message==='No data'){
          //  console.log("NO DATAA")
         }else
         {
           this.seatWidth=res.layoutArray[0].seatWidth;
           this.seatHeight=res.layoutArray[0].seatHeight;
          //  console.log("NO DATAA")
           this.totalNumber=res.totalNoOfWorkstation
           res.layoutArray[0].layoutBorder.forEach((item:any) => {
             const {_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull } = item;
             this.getAllPoints.push({_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull });

           });
           res.layoutArray[0].pillarsData.forEach((item:any)=>{
            const {x,y,height,width } = item;
            this.pillarData.push({x,y,height,width});

          })

           // this.layer.clearBeforeDraw
      //        for (const shape of res.layoutArray[0].layoutBorder) {
      //         const rect = new Konva.Rect({
      //            x: shape.startX,
      //            y: shape.startY,
      //            width: shape.rectWidth,
      //            height: shape.rectHeight,
      //            stroke:'red',
      //            strokeWidth:0.1,
      //              name:shape._id
      //          });

      //          this.seatLayer.add(rect);

      //          rect.on('mousedown',()=>{
      //            let transformNew = new Konva.Transformer()
      //          this.seatLayer.add(transformNew);
      //          transformNew.nodes([rect])
      //            this.transformer=transformNew
      //           //  console.log("FIRST BEFORE",rect)
      //          rect.on('transformend', () => {
      //            // if (this.selectedShape) {
      //              // console.log('RECT NAME',rect.attrs())
      //              const updatedWidth = rect.width() * rect.scaleX();
      //              const updatedHeight = rect.height() * rect.scaleY();
      //              const updatedX = rect.x();
      //              const updatedY = rect.y();
      //              const indexToUpdate = this.getAllPoints.findIndex((point) => point._id === rect.name());

      //              if (indexToUpdate !== -1) {
      //                // Update the object at the found index
      //                this.getAllPoints[indexToUpdate] = {
      //                  ...this.getAllPoints[indexToUpdate], // Copy existing properties
      //                  startX: updatedX,
      //                  startY: updatedY,
      //                  rectWidth: updatedWidth,
      //                  rectHeight: updatedHeight,
      //                  endX: updatedX + updatedWidth,
      //                  endY: updatedY + updatedHeight,
      //                };

      //               //  console.log("AFTER UPDATE", this.getAllPoints[indexToUpdate]);
      //              }

      //          });
      //          })


      //  }
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

      // this.backgroundLayer.cache()
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
      // this.seatLayer.clearCache();
      // this.backgroundLayer.clearCache\.()
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
  backgroundLayer!:Konva.Layer
  seatLayer!:Konva.Layer
   initializeKonva(imageObj: HTMLImageElement): void {
     this.stage = new Konva.Stage({
       container: 'container',
       width: this.customWidth,
       height: this.customHeight,
     });

     this.backgroundLayer = new Konva.Layer({
      name: 'backgroundLayer',
      listening:false
    });
    this.stage.add(this.backgroundLayer);


    // Create a layer for the seat rectangles
    this.seatLayer = new Konva.Layer({
      name: 'seatLayer',
    });
    this.stage.add(this.seatLayer);
     this.backgroundImage = new Konva.Image({
       image: imageObj,
       width: this.customWidth,
       height: this.customHeight,
       name:'bgImage'
     });

     this.backgroundLayer.add(this.backgroundImage);
     this.backgroundLayer.draw();
    //  this.drawRectangles()
   }

   drawRectangles(){
    let count=0
    let drawTotalSeatsBetweenGap=8
    this.getAllPoints.forEach((borderRoom) => {
      let startX = borderRoom.startX;
      let startY = borderRoom.startY;
      let endX = borderRoom.endX;
      let endY = borderRoom.endY;
      let drawPassage = false;

        let x = startX;
        let y = startY;
        let previosWidth;
      // let newRect  =  new Konva.Rect({
      //   X:startX,
      //   y:startY,
      //   width:endX-startX,
      //   height:endY-startY,
      //   fill: "red",
      //   opacity:0.5
      // })
      // this.seatLayer.add(newRect);
      let gapArriveAfter = 0
      let checkForPillar=false
        while(x<endX-2){
          while(y<endY-2){
            if(checkForPillar){
              for(let pillar of this.pillarData ){
                if (
                  x + 1 < pillar.x + pillar.width &&
                  x + this.seatWidth > pillar.x + 2 &&
                  y + 1 < pillar.y + pillar.height &&
                  y + this.seatHeight > pillar.y + 2
                ) {
                  y = pillar.y + pillar.height;

                }
              }
              checkForPillar=false
            }

            if(y>endY-1){
              break
            }
              let newRect  =  new Konva.Rect({
                      x:x,
                      y:y,
                      width:this.seatWidth,
                      height:this.seatHeight,
                      fill: "grey",
                      opacity:0.5,
                      stroke:'black',
                      strokeWidth:0.5
                    })

          this.seatLayer.add(newRect);
          count++
          y+=this.seatHeight
          }
          y=startY
          x+=this.seatWidth
          gapArriveAfter++
          if(gapArriveAfter%8===0){
            debugger
            console.log("CHECKSS",count,gapArriveAfter)
            x+=this.seatWidth
            // if(drawTotalSeatsBetweenGap==4){
            //   drawTotalSeatsBetweenGap=12
            // }else if(drawTotalSeatsBetweenGap==8){
            //   drawTotalSeatsBetweenGap=16
            // }else if(drawTotalSeatsBetweenGap==16){
            //   drawTotalSeatsBetweenGap=8
            // }
            debugger
            checkForPillar=true
          }

        }
    });
    this.seatLayer.batchDraw();
    this.seatCounted=count
    console.log(count,"This are the number of seat drawn")
    this.pillarData.forEach(pillar=>{
      // console.log(pillar)
      let newRect =  new Konva.Rect({
        x:pillar.x,
        y:pillar.y,
        width:pillar.width,
        height:pillar.height,
        fill:'green',
        opacity:0.8,
        stroke:'black',
        strokeWidth:0.5
      })
      this.seatLayer.add(newRect)
    })
    this.seatLayer.batchDraw()
   }
   seatCounted=0
     addLayout(){
      let data = {
        LayoutData:{layoutBorder:this.getAllPoints,
          seatHeight:this.seatHeight,
          seatWidth:this.seatWidth,
          pillarData:this.pillarData}
           }

      this.locationService.addLayoutData(this.id,data).subscribe(res=>{
        this.router.navigate(['/admin','location','layout-editor',this.id])
      })
    }
    removeImage(){
     this.backgroundImage.destroy();
     this.seatLayer.draw()
    }

}
