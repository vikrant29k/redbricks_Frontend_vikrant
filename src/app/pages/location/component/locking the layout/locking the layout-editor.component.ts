import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { LocationService } from 'src/app/service/location/location.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-lock-layout-editor',
  templateUrl: './locking the layout-editor.component.html',
  styleUrls: ['./locking the layout-editor.component.scss'],
})
export class LockLayoutEditorComponent implements OnInit, AfterViewInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  line!: Konva.Line;
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
        }else{
          res.layoutArray[0].layoutBorder.forEach((item:any) => {
            const {_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight } = item;
            this.getAllPoints.push({_id, startX, startY, endX, endY, shape,seatHeight,seatWidth,rectWidth,rectHeight });

          });
this.displayRectangles()
      for (const shape of res.layoutArray[0].layoutBorder) {

       const rect = new Konva.Rect({
          x: shape.startX,
          y: shape.startY,
          width: shape.rectWidth,
          height: shape.rectHeight,
          fill: 'blue',
          opacity: 0.3,
          name:shape._id,
          draggable: false,
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

  })
  }
  drawTHeSeat(){
    for (const seat of this.drawnSeats) {
      this.drawSeatsBetweenPoints(seat.start, seat.end,seat.seatPosition);
    }
  }
  drawSeatsBetweenPoints(start:any, end:any,seatPosition:any) {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const endX = Math.max(start.x, end.x);
    const endY = Math.max(start.y, end.y);
    const seatSizeWidth = this.seatSizeWidth; // Extract width from seatSize
    const seatSizeHeight = this.seatSizeHeight; // Extract height from seatSize
    if(seatPosition==false){
      for (let x = startX; x < endX; x += seatSizeHeight) {
        for (let y = startY; y < endY; y += seatSizeWidth) {
          this.drawSeatRectangle(x, y,seatSizeHeight,seatSizeWidth);
        }
      }
    }else{
      for (let x = startX; x < endX; x += seatSizeWidth) {
        for (let y = startY; y < endY; y += seatSizeHeight) {
          this.drawSeatRectangle(x, y,seatSizeWidth,seatSizeHeight);
        }
      }
    }
    // for (let x = startX; x < endX; x += this.seatSizeWidth) {
    //   for (let y = startY; y < endY; y += this.seatSizeHeight) {
    //     this.drawSeatRectangle(x, y);
    //   }
    // }
  }
  drawSeatRectangle(x:any, y:any,width:any,height:any) {
    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height:height,
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

  seatDrawing: boolean = false;
  isSeatDrawingEnabled = false;





  displayRectangles() {
    this.drawTHeSeat()
  }
  updateStoredValues(){


  // this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      // console.log(res);
      this.proposalService.lockProposal(this.proposalId, { lockProposal:true })
            .subscribe((res:any) => {
              console.log(res,"Locked Proposal")
            });
      this.router.navigate(['/admin','location','location-list'])
    // })
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
