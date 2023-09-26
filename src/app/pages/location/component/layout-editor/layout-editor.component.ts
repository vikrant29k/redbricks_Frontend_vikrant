import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  // selectedShape!: Konva.Shape;
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
               private locationService: LocationService
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
          // console.log("NO DATAA")
        }else
        {
          // console.log("NO DATAA")
          this.seatWidth=res.layoutArray[0].seatWidth;
          this.seatHeight=res.layoutArray[0].seatHeight;
          //getAllpoints array is been updated with old data
          res.layoutArray[0].layoutBorder.forEach((item:any) => {
            const {_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull } = item;
            this.getAllPoints.push({_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight,seatPosition,isFull });

          });

          //pillarData array
          res.layoutArray[0].pillarData.forEach((item:any) => {
            const {_id, startX, startY, pillarRect,pilarWidth } = item;
            this.pillarData.push({_id, startX, startY,pillarRect,pilarWidth });

          });
          // this.layer.clearBeforeDraw
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
              // console.log("FIRST BEFORE",rect)
            rect.on('transformend', () => {
              // if (this.selectedShape) {
                // console.log('RECT NAME',rect.attrs())
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

                  // console.log("AFTER UPDATE", this.getAllPoints[indexToUpdate]);
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
  timesofRectDrawn=0
  updatedX:any;
  updatedY:any;
  updatedWidth:any;
  updatedHeight:any
  handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void {
    this.letSeatMove = true;
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
        fill: 'lightblue',
        opacity: 0.3,
        stroke: '#000000',
        strokeWidth: 0.8,
      });

      // Create a Konva circle for seatPosition control
      const seatPositionCircle = new Konva.Circle({
        x: pos.x + 10, // Adjust the position as needed
        y: pos.y - 10, // Adjust the position as needed
        radius: 5, // Adjust the radius as needed
        fill: 'green', // Choose a color for the circle
      });
      this.layer.add(seatPositionCircle);
      seatPositionCircle.on('mousedown', () => {

        const arrayElement = this.getAllPoints.find((point) => {
          return point.startX === this.shape.x() && point.startY === this.shape.y();
        });
        seatPositionCircle.on('mouseup', () => {
          seatPositionCircle.fill('red')
        })


        if (arrayElement) {
          // Toggle the seatPosition property when the circle is clicked
          arrayElement.seatPosition = !arrayElement.seatPosition;

        }
      });

      // Add the seatPosition circle to the layer



      this.layer.add(this.shape);
      this.layer.batchDraw();

      this.shape.on('mousedown', () => {
        let transformNewShape = new Konva.Transformer();
        this.layer.add(transformNewShape);
        transformNewShape.nodes([this.shape]);
        this.shape.on('transformend', () => {
          // Get the updated properties from the transformed shape
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

    // Push the new rectangle into the getAllPoints array
    this.getAllPoints.push(rect);
    // console.log(this.getAllPoints);
    // this.shape.destroy()
    this.isDrawingEnabled = !this.isDrawingEnabled;
  }


  seatDrawing: boolean = false;
  isSeatDrawingEnabled = false;
  drawSeatAndGetHW() {
    // this.isSeatDrawingInProgress = false;
    // this.shape.draggable(false)\
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
        // this.layer.batchDraw();
      });

      this.layer.add(this.seatShape, transformer);
      transformer.attachTo(this.seatShape);
       this.layer.batchDraw();
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
      };
      this.isEnableSaveBtn =true
      this.seatDrawn = 1;
      // this.getHeightWidthOfSeat();
    } else {
    }
  }
seatArray:any[]=[]
  updateSeatsSize() {
console.log("WIDTH==>",this.seatShape.width(),"\nHEIGHT==>",this.seatShape.height())
const height=this.seatShape.height()
const width=this.seatShape.width();
this.seatHeight= height.floor(2);
this.seatWidth =width.floor(2) ;
for (const point of this.getAllPoints) {
  point.seatHeight = this.seatHeight;
  point.seatWidth = this.seatWidth;
}
  }
//finals all layout and save the data..
  addLayout(){
    let data = {
        LayoutData:{layoutBorder:this.getAllPoints,
          seatHeight:this.seatHeight,
          seatWidth:this.seatWidth,
          pillarData:this.pillarData}
           }

    this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      this.router.navigate(['/admin','location','location-list'])
    })
  }





// draws the clients seats
  drawTHeSeat(){
    this.proposalData.forEach(dataOfSeats=>{
  //  console.log(dataOfSeats)
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
    // console.log(x,y)

    // console.log(fill)
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      opacity: 0.5,
      name: 'seat-rectangle',
    });
    this.layer.add(rect);
if(index==true){
  const text = new Konva.Text({
    x: x - width / 2,
    y: y + height / 2,
    text: clientName,
    fontSize: 16,
    fill: 'black',
    align: 'center',
});
const totalSeatsText = new Konva.Text({
  x: x,
  y: y + height + 10, // Adjust the y value as needed
  text: `Total Seats: ${totalNumberOfSeats}`,
  fontSize: 14,
  fill: 'black',
  align: 'center',
});
totalSeatsText.offsetX(totalSeatsText.width() / 2);
this.layer.add(totalSeatsText);
text.offsetX(text.width() / 2);
text.offsetY(text.height() / 2);
this.layer.add(text);
}

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


    goToDrawSeat(){
      this.router.navigate(['/admin','location','preview-seats',this.id])
    }

    drawOutsideBorder(){
      // Draw a borders of different things..
      this.router.navigate(['/admin','location','draw-border',this.id])
    }


    //draw the exrta things like pillars and gaps in workstation
    pillarGapLayer!:Konva.Layer
        startDrawingPillar() {
          this.stage.on('mousedown', this.handleMouseDownForPillar.bind(this));
          this.stage.on('mousemove', this.handleMouseMoveForPillar.bind(this));
          this.stage.on('mouseup', this.handleMouseUpForPillar.bind(this));
        }
    pillarRect!:Konva.Rect;
    isDrawingEnabledForPillar=false
    isDrawingForPillar: boolean = false;
    updatedXForPillar:any;
    updatedYForPillar:any;
    updatedWidthForPillar:any;
    updatedHeightForPillar:any
    toggleDrawingPillar(): void {
      this.isDrawingEnabledForPillar = !this.isDrawingEnabledForPillar;
      this.pillarGapLayer=new Konva.Layer({
        name:'pillarGapLayer',
      })
      this.layer.listening(false)
      this.stage.add(this.pillarGapLayer)
      this.startDrawingPillar();
      if (!this.isDrawingEnabledForPillar) {
        this.isDrawingForPillar = false; // Stop ongoing drawing if disabled
      }
    }
        handleMouseDownForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {
          this.letSeatMove = true;
          if (this.isDrawingEnabledForPillar) {
            this.timesofRectDrawn++;
            const pos: any = this.stage.getPointerPosition();
            this.startPoint = pos;
            this.isDrawingForPillar= true;

            this.pillarRect = new Konva.Rect({
              x: pos.x,
              y: pos.y,
              width: 0,
              height: 0,
              fill: 'green',
              opacity: 0.5,
              stroke: '#000000',
              strokeWidth: 0.8,
            });


            this.pillarGapLayer.add(this.pillarRect);
            this.pillarGapLayer.batchDraw();

            this.pillarRect.on('mousedown', () => {
              let transformNewShape = new Konva.Transformer();
              this.pillarGapLayer.add(transformNewShape);
              transformNewShape.nodes([this.pillarRect]);
              this.pillarRect.on('transformend', () => {
                // Get the updated properties from the transformed shape
                this.updatedXForPillar = this.pillarRect.x();
                this.updatedYForPillar = this.pillarRect.y();
                this.updatedWidthForPillar = this.pillarRect.width() * this.pillarRect.scaleX();
                this.updatedHeightForPillar = this.pillarRect.height() * this.pillarRect.scaleY();
              });
            });
          }
        }


        handleMouseMoveForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {

          if (this.isDrawingEnabledForPillar && this.isDrawingForPillar) {
            const pos: any = this.stage.getPointerPosition();
            const width = pos.x - this.startPoint.x;
            const height = pos.y - this.startPoint.y;
            this.pillarRect.width(width);
            this.pillarRect.height(height);

            this.pillarGapLayer.batchDraw();
          }
        }

        handleMouseUpForPillar(e: Konva.KonvaEventObject<MouseEvent>): void {
          if (this.isDrawingEnabledForPillar && this.isDrawingForPillar) {
            this.isDrawingForPillar= false;
            this.isDrawingEnabledForPillar=!this.isDrawingEnabledForPillar

          }
        }
        pillarData:any[]=[]
        updatePillarData(){

          const pillar = {
            _id: Date.now(),
            startX: this.updatedXForPillar,
            startY: this.updatedYForPillar,
            pilarWidth: this.updatedWidthForPillar,
            pillarRect: this.updatedHeightForPillar,
          };

          // Push the new pillar into the pillarData array
          this.pillarData.push(pillar);

          this.isDrawingEnabledForPillar = !this.isDrawingEnabledForPillar;
        }
selectedPillar:any;
transformerPilar!: Konva.Transformer;
        showOther(){
          this.pillarGapLayer=new Konva.Layer({
            name:'pillarGapLayer',
          })
          this.layer.listening(false)
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
          rect.on('mousedown',()=>{
            let transformNew = new Konva.Transformer()
            this.pillarGapLayer.add(transformNew);
            transformNew.nodes([rect])
              this.selectedPillar=rect
              this.transformerPilar=transformNew

              //transform data capture
            rect.on('transformend', () => {
              // if (this.selectedShape) {
                // console.log('RECT NAME',rect.attrs())
                const updatedWidth = rect.width() * rect.scaleX();
                const updatedHeight = rect.height() * rect.scaleY();
                const updatedX = rect.x();
                const updatedY = rect.y();
                const indexToUpdate = this.pillarData.findIndex((point:any) => String(point._id) === rect.name());

                if (indexToUpdate !== -1) {
                  // Update the object at the found index
                  this.pillarData[indexToUpdate] = {
                    ...this.pillarData[indexToUpdate], // Copy existing properties
                    startX: updatedX,
                    startY: updatedY,
                    pilarWidth: updatedWidth,
                    pillarRect: updatedHeight,

                  };

                  // console.log("AFTER UPDATE", this.pillarData[indexToUpdate]);
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

            this.pillarGapLayer.add(tooltip);

            let deletePillar =new Konva.Rect({
              x:rect.x()-10,
              y:rect.y()-10,
              width:10,
              height:10,
              fill:'red',
              opacity:1
            })
            this.pillarGapLayer.add(deletePillar)
            deletePillar.on('mousemove',()=>{
              var mousePos:any = this.stage.getPointerPosition();
              tooltip.position({
                x: mousePos.x + 5,
                y: mousePos.y + 5,
              });
              tooltip.text('Delete Pillar');
              tooltip.show();
            })
            deletePillar.on('mouseout',()=> {
              tooltip.hide();
            });
            deletePillar.on('click',()=>{
              this.deleteSelectedPillar()
              deletePillar.destroy();
             tooltip.destroy();
            })
          })

          this.pillarGapLayer.add(rect)
        })
       this.pillarGapLayer.batchDraw()
        }

        deleteSelectedPillar(): void {
          if (this.selectedPillar) {
            // Find the index of the selected rectangle in this.pillarData
            const indexToDelete = this.pillarData.findIndex((rect) => {
              return rect.startX === this.selectedPillar.x() && rect.startY === this.selectedPillar.y();
            });

            if (indexToDelete !== -1) {
              // Remove the selected rectangle from this.pillarData
              this.pillarData.splice(indexToDelete, 1);

              // Destroy the selected shape (rectangle) and transformer
              this.selectedPillar.destroy();
              this.transformerPilar.destroy();

              // Clear the selection
              this.selectedPillar = null;
            }
          }
        }
}
