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
      this.id=res[0].locationId
      this.drawnSeats=res[0].seatsData
      this.seatSizeHeight=res[0].seatSize[0].height;
      this.seatSizeWidth=res[0].seatSize[0].width;
    this.locationService.getImageById(this.id).subscribe(
      (imageUrl) => {
        this.imageUrl = environment.baseUrl+'images/' + imageUrl;
        const imageObj = new Image();
         imageObj.onload = () => {
      this.initializeKonva(imageObj);
      this.enableZoom();
      this.locationService.getBorderData(this.id).subscribe((res:any)=>{
        if(res.Message==='No data'){
          // console.log("NO DATAA")
        }else{
          this.seatHeight=res.layoutArray[0].seatHeight;
          this.seatWidth=res.layoutArray[0].seatWidth;

          for (const shape of res.layoutArray[0].layoutBorder) {
            this.getAllPoints.push(shape)

            if (shape.hasOwnProperty('sequenceNo')) {
            const rect = new Konva.Rect({
              x: shape.startX,
              y: shape.startY,
              width: shape.rectWidth,
              height: shape.rectHeight,
              fill: 'blue',
              opacity: 0.2,
            });
              this.layer.add(rect);
              this.layer.draw()
          }
      }
      console.log(this.getAllPoints)
        }
        this.drawSelectedRoom()
      })

    };
    imageObj.src = this.imageUrl;
      },
      error => {
        console.error('Error loading image data:', error);
      }
    );
  })
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
    this.backgroundImage.moveToBottom()
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

  updateStoredValues(){
    let data = {
      LayoutData:{layoutBorder:this.getAllPoints,
        seatHeight:this.seatHeight,
        seatWidth:this.seatWidth,
      }
     }

  this.locationService.addLayoutData(this.id,data).subscribe(res=>{
      this.proposalService.lockProposal(this.proposalId, { lockProposal:true })
            .subscribe((res:any) => {
            });
      this.router.navigate(['/admin','location','location-list'])
    })
  console.log(data)
  }

//draw the room that  are been selected
drawSelectedRoom() {
  this.drawnSeats.forEach(point=>{
    let rect = new Konva.Rect({
      x:point.x,
      y: point.y,
      width: point.width,
      height: point.height,
      fill:point.color,
      opacity:0.5,
      draggable:true

    })

    const matchingPointIndex = this.getAllPoints.findIndex(p => p.sequenceNo == point.rectSequence);

    if (matchingPointIndex !== -1) {
      console.log('SequenceNo:', point.rectSequence);
      console.log('Details before update:', this.getAllPoints[matchingPointIndex]);

      // Update isFull to true
      this.getAllPoints[matchingPointIndex].isFull = true;

      console.log('Details after update:', this.getAllPoints[matchingPointIndex]);
    } else {
      console.log('SequenceNo not found:', point.rectSequence);
    }

    this.layer.add(rect);
    rect.moveToTop()
    this.layer.draw()
  })
  // this.layer.batchDraw()

}

}
