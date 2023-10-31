import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { LocationService } from 'src/app/service/location/location.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-layout-editor',
  templateUrl: './layout-editor.component.html',
  styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit, AfterViewInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
  isEnableSaveBtn:boolean =false
  customWidth = 1080;
  customHeight = 734;
  getAllPoints: any[] = [];
  flowOfDrawingSeats: string = 'vertical';
  seatSizeWidth: any;
  seatSizeHeight: any;
  scrollerContainer!: HTMLDivElement;
  numRectangles!: number;
  imageName!: string;
  points: number[] = [];
  seatWidth: number = 22;
  seatHeight: number = 26;
  rectWidth: number = 0;
  rectHeight: number = 0;
  shape!: Konva.Rect; // Use Rect instead of Line
  seatShape:any | Konva.Rect;
  startPoint: any | { x: number; y: number };
  isDrawing: boolean = false;

  allSelectedLayout: any;
  selectedIdOfLayout: any;
  selectedShape:any| Konva.Rect | null = null; // Initialize it as null since no shape is initially selected

  constructor(private router: Router,
               private route: ActivatedRoute,
               private proposalService:ProposalService,
               private locationService: LocationService,private changeDetectorRef: ChangeDetectorRef
             ) {}
  id!: string;
  imageUrl:any;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['Id'];
    this.proposalService.getProposalByLocationId(this.id).subscribe((res:any)=>{
      // console.log(res)
      if(res.message=='no data'){
        // console.log("NOTHING")
      }else{
        this.extractProposalData(res);
        // console.log(this.proposalData)
      }


    })
  }
  ngAfterViewInit(): void {
   this.getInitialViewLayout()

  }

  drawRect:any;
  getInitialViewLayout = () =>{
    this.locationService.getImageById(this.id).subscribe(
      (imageUrl) => {
        this.imageUrl = environment.baseUrl+'images/' + imageUrl;

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

        }else
        {

          this.seatWidth=res.layoutArray[0].seatWidth;
          this.seatHeight=res.layoutArray[0].seatHeight;
          //getAllpoints array is been updated with old data
          res.layoutArray[0].layoutBorder.forEach((item:any) => {
            //debugger

            const {_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition,isFull } = item;
            this.getAllPoints.push({_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition,isFull });

          });

            for (const shape of res.layoutArray[0].layoutBorder) {
           if(shape.isFull===false){
            const rect = new Konva.Rect({
              x: shape.startX,
              y: shape.startY,
              width: shape.rectWidth,
              height: shape.rectHeight,
              fill: '#488bcf',
              opacity: 0.8,
                draggable: false,
                name:String(shape._id),
                shadowColor: 'black',
      shadowBlur: 8,
      shadowOffset: { x: 0, y: 1 },
      shadowOpacity: 0.2,
            });

            this.layer.add(rect);

            rect.on('mousedown',()=>{
              let transformNew = new Konva.Transformer()
            this.layer.add(transformNew);
            transformNew.nodes([rect])
              this.selectedShape=rect
              this.transformer=transformNew
            rect.on('transformend', () => {
                const updatedWidth = rect.width() * rect.scaleX();
                const updatedHeight = rect.height() * rect.scaleY();
                const updatedX = rect.x();
                const updatedY = rect.y();
                const indexToUpdate = this.getAllPoints.findIndex((point:any) => String(point._id) === rect.name());

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

                }

            });
            let tooltip = new Konva.Text({
              text: '',
              fontFamily: 'Calibri',
              fontSize: 12,
              padding: 5,
              textFill: 'white',
              fill: 'black',
              alpha: 0.75,
              visible: false,
            });
            let deleteShape =new Konva.Rect({
              x:rect.x()-10,
              y:rect.y()-10,
              width:10,
              height:10,
              fill:'red',
              opacity:1
            })
            this.layer.add(deleteShape)
          this.layer.add(tooltip);
          deleteShape.on('mousemove',()=>{
            const mousePos:any = this.stage.getPointerPosition();
            tooltip.position({
              x: mousePos.x + 5,
              y: mousePos.y + 5,
            });
            tooltip.text('Delete Shape');
            tooltip.show()
          })
          deleteShape.on('mouseout', ()=> {
            tooltip.hide();
          });
          deleteShape.on('click',()=>{
            this.deleteSelectedRect();
            tooltip.destroy()
            deleteShape.destroy()

          })
            })
          }

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
  startDrawingRect() {
    this.stage.on('mousedown', this.handleMouseDown.bind(this));
    this.stage.on('mousemove', this.handleMouseMove.bind(this));
    this.stage.on('mouseup', this.handleMouseUp.bind(this));

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

  isDrawingEnabled = false;
  transformer!: Konva.Transformer;
  toggleDrawing(): void {
    this.isDrawingEnabled = !this.isDrawingEnabled;
    this.startDrawingRect();
    if (!this.isDrawingEnabled) {
      this.isDrawing = false; // Stop ongoing drawing if disabled
    }
  }
    //function for getting all proposal data
    proposalData:any[]=[]
    private extractProposalData(res: any): void {

      for (const proposal of res) {
        if (proposal.seatsData && proposal.seatsData.length > 0 && proposal.seatSize) {
          const proposalObject = {
              clientName:proposal.clientName,
              totalNumberOfSeats:proposal.totalNumberOfSeats,
              seatsData: proposal.seatsData.map((seat:any, index:any) => ({
                  ...seat,
                  first: index === 0, // Set "first" to true for the first object, false for others
              })),
              seatSize: proposal.seatSize,
              color: proposal.color,
          };
          this.proposalData.push(proposalObject);
      }
      }
    }

  letSeatMove:boolean=true
  seatsDrawn:boolean=false;
  timesofRectDrawn=0
  updatedX!:number;
  updatedY!:number;
  updatedWidth!:number;
  updatedHeight!:number
  handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void {
    // console.log(this.isDrawingEnabled,'BEFORE IF')
    if (this.isDrawingEnabled) {
      // console.log(this.isDrawingEnabled,"AFTER IF")
        this.timesofRectDrawn++;
        const pos: any = this.stage.getPointerPosition();
        this.startPoint = pos;
        this.isDrawing = true;

        // Check if the shape already exists, and if not, create a new one
        // if (!this.shape) {
            this.shape = new Konva.Rect({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                fill: 'lightblue',
                opacity: 0.3,
                stroke: '#000000',
                strokeWidth: 0.8,
            });

            this.layer.add(this.shape);
            let transformNewShape = new Konva.Transformer({
              ignoreStroke:true
            });
            this.layer.add(transformNewShape);
            transformNewShape.nodes([this.shape]);
            // this.shape.on('click', () => {
            //   let transformNewShape = new Konva.Transformer({
            //     ignoreStroke:true,
            //     name:'shapeTransformer'
            //   });
            //   this.layer.add(transformNewShape);
            //   transformNewShape.nodes([this.shape]);
            // })

              this.shape.on('transformend', () => {
                // Get the updated properties from the transformed shape
                this.updatedX = this.shape.x();
                this.updatedY = this.shape.y();
                this.updatedWidth = this.shape.width() * this.shape.scaleX();
                this.updatedHeight = this.shape.height() * this.shape.scaleY();

              });

            let updateButton = new Konva.Rect({
              x: this.shape.x() + 20,
              y: this.shape.y() - 10,
              width: 10,
              draggable:true,
              height: 10,
              fill: 'grey'
          });
          updateButton.moveToTop()
          updateButton.on('mouseenter',()=>{
            tooltip.x(updateButton.x()-5);
            tooltip.y(updateButton.y()-30);
            tooltip.text('Update This Border')
            tooltip.show()
          })
          updateButton.on('mouseout',()=>{
            tooltip.hide()
          })
          // Add the 'Update' button to the layer
          this.layer.add(updateButton);
          let seatpostio: boolean = true;
          let rect:any;
          updateButton.on('click', () => {
               rect = {
                  _id: Date.now(),
                  startX: this.updatedX,
                  startY: this.updatedY,
                  endX: this.updatedX + this.updatedWidth,
                  endY: this.updatedY + this.updatedHeight,
                  rectWidth: this.updatedWidth,
                  rectHeight: this.updatedHeight,
                  isFull: false,
                  seatPosition: seatpostio
              };

              this.drawRectangles(rect);
              transformNewShape.nodes([])
              // this.seatsDrawn=true
              // this.getAllPoints.push(rect);
              // this.isDrawingEnabled = !this.isDrawingEnabled;
          });
          updateButton.on('dblclick',()=>{
            this.removeSeats()
            transformNewShape.nodes([this.shape])
          })
            let pushButton =new  Konva.Rect({
              x: this.shape.x()- 10,
              y: this.shape.y() + 20,
              width: 10,
              height: 10,
              cornerRadius:10,
              draggable:true,
              fill: 'orange'
            })
            this.layer.add(pushButton);
            pushButton.on('mouseenter',()=>{
              tooltip.x(pushButton.x()-20);
              tooltip.y(pushButton.y()+30);
              tooltip.text('Final This Border')
              tooltip.show()
            })
            pushButton.on('mouseout',()=>{
              tooltip.hide()
            })
            pushButton.on('click',()=>{

              this.getAllPoints.push(rect);
    // Set isDrawingEnabled to true to enable drawing of new rectangles
    this.isDrawingEnabled = true;

    // Destroy the current shape, pushButton, seatPositionCircle, and other related elements
    this.shape.destroy();
    pushButton.destroy();
    seatPositionCircle.destroy();
    updateButton.destroy();
    transformNewShape.destroy()

    // Find and destroy any Transformers with the name 'shapeTransformer'
    let transformers = this.layer.find('.shapeTransformer');
    transformers.forEach(transformer => {
        transformer.destroy();
    });

    // Redraw the layer
    this.layer.batchDraw();
            })

            //seatPosition will change the vertical horizontal printing of rect
            const seatPositionCircle = new Konva.Circle({
              draggable:true,
                x: pos.x, // Adjust the position as needed
                y: pos.y - 10, // Adjust the position as needed
                radius: 5, // Adjust the radius as needed
                fill: 'green', // Choose a color for the circle\
            });
            seatPositionCircle.on('mouseenter',()=>{
              tooltip.x(seatPositionCircle.x()-10);
              tooltip.y(seatPositionCircle.y()-25);
              tooltip.text('Rotate Seats')
              tooltip.show()
            })
            seatPositionCircle.on('mouseout',()=>{
              tooltip.hide()
            })
            seatPositionCircle.on('click', () => {
              seatpostio=!seatpostio

              if(seatpostio){
                seatPositionCircle.fill('red');
              }else{
                seatPositionCircle.fill('green');
              }

            });

            let tooltip = new Konva.Text({
                text: '',
                fontFamily: 'Calibri',
                fontSize: 9,
                padding: 5,
                textFill: 'white',
                fill: 'black',
                alpha: 0.75,
                visible: false,
            });

            //added all shapes in the layer
            this.layer.add(seatPositionCircle, tooltip);

        // }else{
        //   console.log('HAVE SHAPE')
        // }

        this.layer.batchDraw();
    }
}

drawingEnabled:boolean=true
totalNumebr:number=100

drawRectangles(array:any) {
  // console.log(array,"DATAAA")
  let count = 0;
  if (!this.stage) return;
  if (this.drawingEnabled === true) {
    let remainingSeats = this.totalNumebr;

    // for (const point of array) {
      const minX = array.startX;
      const minY = array.startY;
      const maxX = array.endX;
      const maxY = array.endY;
      // console.log("name of rect",array._id,
      // "\n minX=",array.startX,
      // "\n maxX=>",array.endX,
      // "\n width of rect=>", array.endX-array.startX);
      // console.log("MAX Columns can be added==>",Math.round((maxX-minX)/this.seatWidth))
      const availableWidth = maxX - minX;
      const availableHeight = maxY - minY;
      const maxHorizontalRectangles = Math.floor(availableWidth / this.seatWidth);
      const maxVerticalRectangles = Math.floor(availableHeight / this.seatHeight);
      const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;

      const polygon = new Konva.Line({
        points: array,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 0.3,
      });
      this.layer.add(polygon);

      if (this.flowOfDrawingSeats == 'vertical') {
        const columns = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
        const seatWidth = array.seatPosition ? this.seatWidth : this.seatHeight; // Check seatPosition
            const seatHeight = array.seatPosition ? this.seatHeight :this.seatWidth;
        for (let column = 0; column < columns; column++) {
          for (let y = minY; y < maxY - 10; y += seatHeight) {
            const x = minX + column * seatWidth;

            if (remainingSeats > 0 && Konva.Util.haveIntersection({ x, y, width: seatWidth, height: seatHeight }, polygon.getClientRect())) {
              this.drawSeatRectangle(x, y, seatHeight, seatWidth); // Swap seatHeight and seatWidth
              remainingSeats--;
              count++;
            }
          }
        }

      }
      // this.totalNumebr = remainingSeats;

    }
    // console.log(this.totalNumebr)
    // Trigger rendering
    this.layer.batchDraw();
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



  seatDrawing: boolean = false;
  isSeatDrawingEnabled = false;



seatArray:any[]=[]
drawSeatAndGetHW() {
  this.seatShape = new Konva.Rect({
    x: this.customWidth / 2,
    y: this.customHeight / 2,
    width: this.seatWidth,
    height: this.seatHeight,
    fill: 'red',
    opacity: 0.5,
    draggable: true,
  });

  this.layer.add(this.seatShape);

  // Create a Transformer
  this.transformer = new Konva.Transformer();
  this.layer.add(this.transformer);

  // Bind the Transformer to the seat shape
  this.transformer.nodes([this.seatShape]);
let width,height;
  this.seatShape.on('transform', () => {
    // Get the updated properties from the transformed shape
    width = this.seatShape.width() * this.seatShape.scaleX();
    height= this.seatShape.height() * this.seatShape.scaleY();
    this.updateInputFields(width,height);
    // this.layer.batchDraw();

  });

  this.layer.draw();
}

// Function to update the shape from input fields
updateShapeFromInput() {
  let width = this.seatWidth* this.seatShape.scaleX()
  let height = this.seatHeight * this.seatShape.scaleY();
  this.seatShape.width(width);
  this.seatShape.height(height);
  this.transformer.forceUpdate(); // Update the Transformer
  this.layer.batchDraw();
}

// Function to update the input fields from the shape
updateInputFields(width:any, height:any) {
  // console.log(width,height)
  this.seatWidth =Number(width.toFixed(2))
  this.seatHeight =Number(height.toFixed(2))
}

updateSeatsSize() {
  // console.log(this.seatWidth,this.seatHeight)
  this.transformer.destroy()
  this.seatShape.destroy()
  // const height=this.seatShape.height()
  // const width=this.seatShape.width();
  // console.log(height,width)
  // this.seatHeight= height.floor(2);
  // this.seatWidth =width.floor(2) ;

}
//finals all layout and save the data..
  addLayout(){
    let data = {
        LayoutData:{layoutBorder:this.getAllPoints,
          seatHeight:this.seatHeight,
          seatWidth:this.seatWidth,

        }
           }

    this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      this.router.navigate(['/admin','location','location-list'])
    })
  }

  //delete the selected rect
  deleteSelectedRect(): void {
    if (this.selectedShape) {
      // Find the index of the selected rectangle in this.getAllPoints
      const indexToDelete = this.getAllPoints.findIndex((rect) => {
        return rect.startX === this.selectedShape.x() && rect.startY === this.selectedShape.y();
      });

      if (indexToDelete !== -1) {
        // Remove the selected rectangle from this.getAllPoints
        this.getAllPoints.splice(indexToDelete, 1);

        // Destroy the selected shape (rectangle) and transformer
        this.selectedShape.destroy();
        this.transformer.destroy();

        // Clear the selection
        this.selectedShape = null;

      }
    }
  }


   drawSeatRectangle(x:number, y:number,height:number,width:number) {
     const rect = new Konva.Rect({
       x: x,
       y: y,
       width: width,
       height: height,
       fill: 'blue',
       opacity: 0.4,
       stroke: 'red',
       strokeWidth: 0.2,
       name: 'seat-rectangle',
     });
     this.layer.add(rect);
    //  this.layer.draw()
   }
   removeSeats(){
    let allShapes=this.layer.find('.seat-rectangle');
    allShapes.forEach(seat=>{
      seat.destroy()

    })
    this.layer.batchDraw()
   }

  // draws the clients seats
  // drawTHeSeat(){
  //   this.proposalData.forEach(dataOfSeats=>{
  // //  console.log(dataOfSeats)
  //     for (const seat of dataOfSeats.seatsData) {

  //       this.drawSeatsBetweenPoints(seat.start, seat.end,seat.seatPosition,dataOfSeats.seatSize, dataOfSeats.color, seat.first,dataOfSeats.clientName,dataOfSeats.totalNumberOfSeats);
  //     }
  //   })

  // }

  // drawSeatsBetweenPoints(start:any, end:any,seatPosition:any,seatSize:any,color:any, index:any, clientName:string,totalNumberOfSeats:number) {

  //   const startX = Math.min(start.x, end.x);
  //   const startY = Math.min(start.y, end.y);
  //   const endX = Math.max(start.x, end.x);
  //   const endY = Math.max(start.y, end.y);
  //   const seatSizeWidth = seatSize[0].width; // Extract width from seatSize
  //   const seatSizeHeight = seatSize[0].height; // Extract height from seatSize
  //   if(seatPosition==false){
  //     for (let x = startX; x < endX; x += seatSizeHeight) {
  //       for (let y = startY; y < endY; y += seatSizeWidth) {
  //         this.drawSeatRectangle(x, y,color,seatSizeWidth,seatSizeHeight,index,clientName,totalNumberOfSeats);
  //       }
  //     }
  //   }else{
  //     for (let x = startX; x < endX; x += seatSizeWidth) {
  //       for (let y = startY; y < endY; y += seatSizeHeight) {
  //         this.drawSeatRectangle(x, y,color,seatSizeHeight,seatSizeWidth,index,clientName,totalNumberOfSeats);
  //       }
  //     }
  //   }
  // }

//   drawSeatRectangle(x:any, y:any, fill:string, height:number, width:number, index:any, clientName:string,totalNumberOfSeats:number) {
//     // console.log(x,y)

//     // console.log(fill)
//     const rect = new Konva.Rect({
//       x: x,
//       y: y,
//       width: width,
//       height: height,
//       fill: fill,
//       opacity: 0.5,
//       name: 'seat-rectangle',
//     });
//     this.layer.add(rect);
// if(index==true){
//   const text = new Konva.Text({
//     x: x - width / 2,
//     y: y + height / 2,
//     text: clientName,
//     fontSize: 16,
//     fill: 'black',
//     align: 'center',
// });
// const totalSeatsText = new Konva.Text({
//   x: x,
//   y: y + height + 10, // Adjust the y value as needed
//   text: `Total Seats: ${totalNumberOfSeats}`,
//   fontSize: 14,
//   fill: 'black',
//   align: 'center',
// });
// totalSeatsText.offsetX(totalSeatsText.width() / 2);
// this.layer.add(totalSeatsText);
// text.offsetX(text.width() / 2);
// text.offsetY(text.height() / 2);
// this.layer.add(text);
// }

//   }

  //seatArray:any[]=[]




    // drawOutsideBorder(){
    //   // Draw a borders of different things..
    //   this.router.navigate(['/admin','location','draw-border',this.id])
    // }

    //draw the exrta things like pillars and gaps in workstation
//     pillarGapLayer!:Konva.Layer
//         startDrawingPillar() {
//           this.stage.on('mousedown', this.handleMouseDownForPillar.bind(this));
//           this.stage.on('mousemove', this.handleMouseMoveForPillar.bind(this));
//           this.stage.on('mouseup', this.handleMouseUpForPillar.bind(this));
//         }
//     pillarRect!:Konva.Rect;
//     isDrawingEnabledForPillar=false
//     isDrawingForPillar: boolean = false;
//     updatedXForPillar:any;
//     updatedYForPillar:any;
//     updatedWidthForPillar:any;
//     updatedHeightForPillar:any
//     toggleDrawingPillar(): void {
//       this.isDrawingEnabledForPillar = !this.isDrawingEnabledForPillar;
//       this.pillarGapLayer=new Konva.Layer({
//         name:'pillarGapLayer',
//       })
//       this.layer.listening(false)
//       this.stage.add(this.pillarGapLayer)
//       this.startDrawingPillar();
//       if (!this.isDrawingEnabledForPillar) {
//         this.isDrawingForPillar = false; // Stop ongoing drawing if disabled
//       }
//     }
//         handleMouseDownForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {
//           this.letSeatMove = true;
//           if (this.isDrawingEnabledForPillar) {
//             this.timesofRectDrawn++;
//             const pos: any = this.stage.getPointerPosition();
//             this.startPoint = pos;
//             this.isDrawingForPillar= true;

//             this.pillarRect = new Konva.Rect({
//               x: pos.x,
//               y: pos.y,
//               width: 0,
//               height: 0,
//               fill: 'green',
//               opacity: 0.5,
//               stroke: '#000000',
//               strokeWidth: 0.8,
//             });


//             this.pillarGapLayer.add(this.pillarRect);
//             this.pillarGapLayer.batchDraw();

//             this.pillarRect.on('mousedown', () => {
//               let transformNewShape = new Konva.Transformer();
//               this.pillarGapLayer.add(transformNewShape);
//               transformNewShape.nodes([this.pillarRect]);
//               this.pillarRect.on('transformend', () => {
//                 // Get the updated properties from the transformed shape
//                 this.updatedXForPillar = this.pillarRect.x();
//                 this.updatedYForPillar = this.pillarRect.y();
//                 this.updatedWidthForPillar = this.pillarRect.width() * this.pillarRect.scaleX();
//                 this.updatedHeightForPillar = this.pillarRect.height() * this.pillarRect.scaleY();
//               });
//             });
//           }
//         }


//         handleMouseMoveForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {

//           if (this.isDrawingEnabledForPillar && this.isDrawingForPillar) {
//             const pos: any = this.stage.getPointerPosition();
//             const width = pos.x - this.startPoint.x;
//             const height = pos.y - this.startPoint.y;
//             this.pillarRect.width(width);
//             this.pillarRect.height(height);

//             this.pillarGapLayer.batchDraw();
//           }
//         }

//         handleMouseUpForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {
//           if (this.isDrawingEnabledForPillar && this.isDrawingForPillar) {
//             this.isDrawingForPillar= false;
//             this.isDrawingEnabledForPillar=!this.isDrawingEnabledForPillar

//           }
//         }
//         pillarData:any[]=[]
//         updatePillarData(){

//           const pillar = {
//             _id: Date.now(),
//             startX: this.updatedXForPillar,
//             startY: this.updatedYForPillar,
//             pilarWidth: this.updatedWidthForPillar,
//             pillarRect: this.updatedHeightForPillar,
//           };

//           // Push the new pillar into the pillarData array
//           this.pillarData.push(pillar);

//           this.isDrawingEnabledForPillar = !this.isDrawingEnabledForPillar;
//         }
// selectedPillar:any;
// transformerPilar!: Konva.Transformer;
      //   showOther(){
      //     this.pillarGapLayer=new Konva.Layer({
      //       name:'pillarGapLayer',
      //     })
      //     this.layer.listening(false)
      //     this.stage.add(this.pillarGapLayer)
      //     this.pillarData.forEach(data=>{
      //       let rect = new Konva.Rect({
      //         x: data.startX,
      //         y: data.startY,
      //         width: data.pilarWidth,
      //         height: data.pillarRect,
      //         fill: 'gray',
      //         opacity: 0.7,
      //         stroke: 'transparent',
      //         strokeWidth: 0.01,
      //         shadowColor: 'black',
      //   shadowBlur: 7,
      //   shadowOffset: { x: 0, y: 1 },
      //   shadowOpacity: 0.5,
      //         name:String(data._id)
      //     })
      //     rect.cache()
      //     rect.on('mousedown',()=>{
      //       rect.clearCache()
      //       let transformNew = new Konva.Transformer()
      //       this.pillarGapLayer.add(transformNew);
      //       transformNew.nodes([rect])
      //         this.selectedPillar=rect
      //         this.transformerPilar=transformNew

      //         //transform data capture
      //       rect.on('transformend', () => {
      //         // if (this.selectedShape) {
      //           // console.log('RECT NAME',rect.attrs())
      //           const updatedWidth = rect.width() * rect.scaleX();
      //           const updatedHeight = rect.height() * rect.scaleY();
      //           const updatedX = rect.x();
      //           const updatedY = rect.y();
      //           const indexToUpdate = this.pillarData.findIndex((point:any) => String(point._id) === rect.name());

      //           if (indexToUpdate !== -1) {
      //             // Update the object at the found index
      //             this.pillarData[indexToUpdate] = {
      //               ...this.pillarData[indexToUpdate], // Copy existing properties
      //               startX: updatedX,
      //               startY: updatedY,
      //               pilarWidth: updatedWidth,
      //               pillarRect: updatedHeight,

      //             };

      //             // console.log("AFTER UPDATE", this.pillarData[indexToUpdate]);
      //           }

      //       });
      //       let tooltip = new Konva.Text({
      //         text: '',
      //         fontFamily: 'Calibri',
      //         fontSize: 12,
      //         padding: 5,
      //         textFill: 'white',
      //         fill: 'black',
      //         alpha: 0.75,
      //         visible: false,
      //       });

      //       this.pillarGapLayer.add(tooltip);

      //       let deletePillar =new Konva.Rect({
      //         x:rect.x()-10,
      //         y:rect.y()-10,
      //         width:10,
      //         height:10,
      //         fill:'red',
      //         opacity:1
      //       })
      //       this.pillarGapLayer.add(deletePillar)
      //       deletePillar.on('mousemove',()=>{
      //         var mousePos:any = this.stage.getPointerPosition();
      //         tooltip.position({
      //           x: mousePos.x + 5,
      //           y: mousePos.y + 5,
      //         });
      //         tooltip.text('Delete Pillar');
      //         tooltip.show();
      //       })
      //       deletePillar.on('mouseout',()=> {
      //         tooltip.hide();
      //       });
      //       deletePillar.on('click',()=>{
      //         this.deleteSelectedPillar()
      //         deletePillar.destroy();
      //        tooltip.destroy();
      //       })
      //     })

      //     this.pillarGapLayer.add(rect)
      //   })
      //  this.pillarGapLayer.batchDraw()
      //   }

      //   deleteSelectedPillar(): void {
      //     if (this.selectedPillar) {
      //       // Find the index of the selected rectangle in this.pillarData
      //       const indexToDelete = this.pillarData.findIndex((rect) => {
      //         return rect.startX === this.selectedPillar.x() && rect.startY === this.selectedPillar.y();
      //       });

      //       if (indexToDelete !== -1) {
      //         // Remove the selected rectangle from this.pillarData
      //         this.pillarData.splice(indexToDelete, 1);

      //         // Destroy the selected shape (rectangle) and transformer
      //         this.selectedPillar.destroy();
      //         this.transformerPilar.destroy();

      //         // Clear the selection
      //         this.selectedPillar = null;
      //       }
      //     }
      //   }
}
