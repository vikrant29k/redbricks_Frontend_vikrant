import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';
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
  isEnableDrowSeatBtn:boolean = false
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
  seatWidth: number = 18.9;
  seatHeight: number = 21.5;
  rectWidth: number = 0;
  rectHeight: number = 0;
  shape!: Konva.Rect; // Use Rect instead of Line
  seatShape:any | Konva.Rect;
  startPoint: any | { x: number; y: number };
  isDrawing: boolean = false;
  isDeleteShape: boolean =false;
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
        console.log("NOTHING")
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
                this.selectedShape=rect
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
    this.letSeatMove=true;
    if (this.isDrawingEnabled) {
      this.timesofRectDrawn++
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
        // draggable:true,
        stroke: '#000000',
        strokeWidth: 0.8,
        name: `workstation-${this.timesofRectDrawn}`,
      });
     if(this.letSeatMove==true){
      // this.shape.draggable(true)
     }
     this.layer.add(this.shape)
     this.shape.on('mousedown',()=>{
      let transformNewShape=new Konva.Transformer();
    this.layer.add(transformNewShape);
    transformNewShape.nodes([this.shape])
    this.shape.on('transformend', () => {
      // Get the updated properties from the transformed shape
      this.updatedX = this.shape.x();
      this.updatedY = this.shape.y();
      this.updatedWidth = this.shape.width() * this.shape.scaleX();
      this.updatedHeight = this.shape.height() * this.shape.scaleY();

      // Update this.shape with the updated values


    });
      })
      this.layer.batchDraw();

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
      // if (this.transformer) {
      //   this.transformer.attachTo(this.shape); // Reattach transformer
      // }
      this.isDrawingEnabled=!this.isDrawingEnabled
      this.isEnableDrowSeatBtn = true

    }
  }
  addRectDataInArray() {

    const rect = {
      _id: Date.now(),
      startX: this.updatedX,
      startY: this.updatedY,
      endX:this.updatedX + this.updatedWidth,
      endY: this.updatedY + this.updatedHeight,
      rectWidth: this.updatedWidth,
      rectHeight: this.updatedHeight,
      // shape: dataOfRect,
      seatHeight:  this.seatHeight,
      seatWidth: this.seatWidth
    };

    // Push the new rectangle into the getAllPoints array
    this.getAllPoints.push(rect);
    console.log(this.getAllPoints);
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
this.seatHeight= Math.round(height);
this.seatWidth =Math.round(width) ;
for (const point of this.getAllPoints) {
  point.seatHeight = this.seatHeight;
  point.seatWidth = this.seatWidth;
}
  }
//finals all layout and save the data..
  addLayout(){
    let data = {
        LayoutData:{layoutBorder:this.getAllPoints}
           }

    this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      console.log(res);
      this.router.navigate(['/admin','location','location-list'])
    })
  }





// draws the clients seats
  drawTHeSeat(){
    this.proposalData.forEach(dataOfSeats=>{
   console.log(dataOfSeats)
      for (const seat of dataOfSeats.seatsData) {

        this.drawSeatsBetweenPoints(seat.start, seat.end,dataOfSeats.seatSize, dataOfSeats.color, seat.first,dataOfSeats.clientName,dataOfSeats.totalNumberOfSeats);
      }
    })

  }
  drawSeatsBetweenPoints(start:any, end:any,seatSize:any,color:any, index:any, clientName:string,totalNumberOfSeats:number) {

    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
    const seatSizeWidth = seatSize[0].width; // Extract width from seatSize
    const seatSizeHeight = seatSize[0].height; // Extract height from seatSize
    for (let x = startX; x < endX; x += seatSizeWidth) {
      for (let y = startY; y < endY; y += seatSizeHeight) {
        this.drawSeatRectangle(x, y,color,seatSizeHeight,seatSizeWidth,index,clientName,totalNumberOfSeats);
      }
    }
  }

  drawSeatRectangle(x:any, y:any, fill:string, height:number, width:number, index:any, clientName:string,totalNumberOfSeats:number) {
    // console.log(x,y)

    console.log(fill)
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
        this.isDeleteShape = false; // Assuming this flag tracks the selection status
      }
    }
  }

  // width!: number;
  // height!: number;

  //draw custom rect where using input box value
    // drawCustomRect(){
    //   this.stage.on('click',(e)=>{
    //     let x= e.evt.offsetX;
    //     let y = e.evt.offsetY
    //     const rect = new Konva.Rect({
    //       x:x,
    //       y:y,
    //       width:this.width,
    //       height:this.height,
    //       fill:'red',
    //       opacity:0.6,
    //       name:'seat',
    //       draggable:true
    //     })
    //     this.layer.add(rect);
    //     this.layer.draw()
    //   })

    // }

    goToDrawSeat(){
      this.router.navigate(['/admin','location','preview-seats',this.id])
    }

}
