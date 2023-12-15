import { Component, OnInit, AfterViewInit,ElementRef, ViewChild } from '@angular/core';
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
// export class LockLayoutEditorComponent implements OnInit, AfterViewInit {
//   stage!: Konva.Stage;
//   layer!: Konva.Layer;
//   line!: Konva.Line;
//   customWidth = 1080;
//   customHeight = 734;
//   getAllPoints: any[] = [];
//   flowOfDrawingSeats: string = 'vertical';
//   seatSizeWidth: any;
//   seatSizeHeight: any;
//   scrollerContainer!: HTMLDivElement;

//   numRectangles!: number;
//   imageName!: string;
//   points: number[] = [];
//   seatWidth: number = 0;
//   seatHeight: number = 0;
//   rectWidth: number = 0;
//   rectHeight: number = 0;
//   shape!: Konva.Rect; // Use Rect instead of Line
//   seatShape!: Konva.Rect;
//   startPoint: any | { x: number; y: number };
//   isDrawing: boolean = false;
//   constructor(private router: Router,
//                private route: ActivatedRoute,
//                private locationService: LocationService,
//                private proposalService:ProposalService
//              ) {}
//   id!: string;
//   imageUrl:any;
//   proposalId!:string
//   drawnSeats:any[]=[];
//   ngOnInit(): void {
//     this.proposalId = this.route.snapshot.params['proposalId'];
//   }
//   ngAfterViewInit(): void {
//     this.proposalService.getProposalById(this.proposalId).subscribe((res:any)=>{
//       this.id=res[0].locationId
//       this.drawnSeats=res[0].seatsData
//       this.seatSizeHeight=res[0].seatSize[0].height;
//       this.seatSizeWidth=res[0].seatSize[0].width;
//     this.locationService.getImageById(this.id).subscribe(
//       (imageUrl) => {
//         this.imageUrl = environment.baseUrl+'images/' + imageUrl;
//         const imageObj = new Image();
//          imageObj.onload = () => {
//       this.initializeKonva(imageObj);
//       this.enableZoom();
//       this.locationService.getBorderData(this.id).subscribe((res:any)=>{
//         if(res.Message==='No data'){
//           // console.log("NO DATAA")
//         }else{
//           this.seatHeight=res.layoutArray[0].seatHeight;
//           this.seatWidth=res.layoutArray[0].seatWidth;

//           for (const shape of res.layoutArray[0].layoutBorder) {
//             this.getAllPoints.push(shape)

//             if (shape.hasOwnProperty('sequenceNo')) {
//             const rect = new Konva.Rect({
//               x: shape.startX,
//               y: shape.startY,
//               width: shape.rectWidth,
//               height: shape.rectHeight,
//               fill: 'blue',
//               opacity: 0.2,
//             });
//               this.layer.add(rect);
//               this.layer.draw()
//           }
//       }
//       console.log(this.getAllPoints)
//         }
//         this.drawSelectedRoom()
//       })

//     };
//     imageObj.src = this.imageUrl;
//       },
//       error => {
//         console.error('Error loading image data:', error);
//       }
//     );
//   })
//   }

//   backgroundImage!: Konva.Image;
//   initializeKonva(imageObj: HTMLImageElement): void {
//     this.stage = new Konva.Stage({
//       container: 'container',
//       width: this.customWidth,
//       height: this.customHeight,
//     });

//     this.layer = new Konva.Layer({
//       name: 'firstLayer',
//     });
//     this.stage.add(this.layer);

//     this.backgroundImage = new Konva.Image({
//       image: imageObj,
//       width: this.customWidth,
//       height: this.customHeight,
//     });

//     this.layer.add(this.backgroundImage);
//     this.backgroundImage.moveToBottom()
//     this.layer.draw();
//   }

//   enableZoom(): void {
//     const scaleBy = 1.1; // Adjust the scale factor as needed
//     this.stage.on('wheel', (e) => {
//       e.evt.preventDefault();

//       const oldScale = this.stage.scaleX();
//       const pointer: any = this.stage.getPointerPosition();

//       const mousePointTo = {
//         x: (pointer.x - this.stage.x()) / oldScale,
//         y: (pointer.y - this.stage.y()) / oldScale,
//       };

//       const direction = e.evt.deltaY > 0 ? -1 : 1; // Adjust the direction for standard zoom behavior

//       const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

//       this.stage.scale({ x: newScale, y: newScale });

//       const newPos = {
//         x: pointer.x - mousePointTo.x * newScale,
//         y: pointer.y - mousePointTo.y * newScale,
//       };
//       this.stage.position(newPos);
//       this.stage.batchDraw();
//     });
//   }
//   resetZoomAndPosition(): void {
//     // Set the initial scale and position values as per your original configuration
//     const initialScale = 1;
//     const initialPosition = { x: 0, y: 0 };

//     this.stage.scale({ x: initialScale, y: initialScale });
//     this.stage.position(initialPosition);
//     this.stage.batchDraw();
//   }

//   updateStoredValues(){
//     let data = {
//       LayoutData:{layoutBorder:this.getAllPoints,
//         seatHeight:this.seatHeight,
//         seatWidth:this.seatWidth,
//       }
//      }

//   this.locationService.addLayoutData(this.id,data).subscribe(res=>{
//       this.proposalService.lockProposal(this.proposalId, { lockProposal:true })
//             .subscribe((res:any) => {
//             });
//       this.router.navigate(['/admin','location','location-list'])
//     })
//   console.log(data)
//   }

// //draw the room that  are been selected
// drawSelectedRoom() {
//   this.drawnSeats.forEach(point=>{
//     let rect = new Konva.Rect({
//       x:point.x,
//       y: point.y,
//       width: point.width,
//       height: point.height,
//       fill:point.color,
//       opacity:0.5,
//       draggable:true

//     })

//     const matchingPointIndex = this.getAllPoints.findIndex(p => p.sequenceNo == point.rectSequence);

//     if (matchingPointIndex !== -1) {
//       console.log('SequenceNo:', point.rectSequence);
//       console.log('Details before update:', this.getAllPoints[matchingPointIndex]);

//       // Update isFull to true
//       this.getAllPoints[matchingPointIndex].isFull = true;

//       console.log('Details after update:', this.getAllPoints[matchingPointIndex]);
//     } else {
//       console.log('SequenceNo not found:', point.rectSequence);
//     }

//     this.layer.add(rect);
//     rect.moveToTop()
//     this.layer.draw()
//   })
//   // this.layer.batchDraw()

// }

// }
export class LockLayoutEditorComponent implements OnInit, AfterViewInit {

  constructor(
    private proposalService:ProposalService,
    private route: ActivatedRoute,
    private locationService:LocationService
  ) { }
proposalId:any
  ngOnInit(): void {
    this.proposalId = this.route.snapshot.params['proposalId'];

  }
  @ViewChild('stageCanvas', { static: true }) stageCanvas!: ElementRef<HTMLCanvasElement>;
  stage!:Konva.Stage;
  layer!: Konva.Layer
  backgroundImage!: Konva.Image;
  imageUrl:any
  customWidth = 1080;
  customHeight = 734;
  selectedShape:any| Konva.Rect | null = null; // Initialize it as null since no shape is initially selected
  transformer!: Konva.Transformer;
  getAllPoints:any[]=[];
  pillarRectData:any[]=[];
  id:any
  ngAfterViewInit(): void {
    this.proposalService.getProposalById(this.proposalId).subscribe((res:any)=>{
      this.id=res[0].locationId
      this.locationService.getImageById(res[0].locationId).subscribe((imageRes:any)=>{
        this.locationService.getBorderData(res[0].locationId).subscribe((result:any)=>{

          // console.log(res);
          if(res.Message==='No data'){

          }else
          {

            result.layoutArray[0].layoutBorder.forEach((item:any) => {
              const {_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition,isFull,sequenceNo,entryPoint } = item;
              this.getAllPoints.push({_id, startX, startY, endX, endY, shape,rectWidth,rectHeight,seatPosition,isFull,sequenceNo,entryPoint });
            });
            result.layoutArray[0].pillarsData.forEach((item:any)=>{
              const {x,y,height,width } = item;
              this.pillarRectData.push({x,y,height,width});

            })
            for (const shape of result.layoutArray[0].layoutBorder) {
              this.layer.draw()
              debugger
              const rect = new Konva.Rect({
                x: shape.startX,
                y: shape.startY,
                width: shape.rectWidth,
                height: shape.rectHeight,
                fill: shape.isFull?'red':'blue',
                opacity: 0.4,
                draggable: false,
                name:String(shape._id),
              });
              this.layer.add(rect);
                    let sequenceNoToolTip = new Konva.Text({
                      x:rect.x()+(rect.width()/2),
                      y:rect.y()+ (rect.height()/2),
                      text: shape.sequenceNo,
                      fontFamily: 'Calibri',
                      fontSize: 10,
                      padding: 5,
                      textFill: 'white',
                      fill: 'black',
                      alpha: 0.75,
                      visible: true,
                    })
                    this.layer.add(sequenceNoToolTip)
                    rect.cache()
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
                    rect.on('contextmenu', (e: any) => {
                      e.evt.preventDefault();

                      // Find the index of the object in getAllPoints array
                      const indexToUpdate = this.getAllPoints.findIndex((point: any) => String(point._id) === rect.name());
                      console.log("CALLED CONTEXT", indexToUpdate);

                      // Check if the object at the found index has the property sequenceNo
                      if (!this.getAllPoints[indexToUpdate].hasOwnProperty('sequenceNo') || !this.getAllPoints[indexToUpdate].sequenceNo) {
                        console.log("NYYYYY AVAILABLE")
                        // If it doesn't have sequenceNo, add an object with sequenceNo set to the value returned by getSequenceNo
                        this.getAllPoints[indexToUpdate].sequenceNo = Number(this.getSequenceNo());
                      }else{
                        console.log("HYYY AVAILABLE")
                        let editSequenceButton=new Konva.Rect({
                          x:rect.x()+10,
                          y:rect.y()-15,
                          width:10,
                          height:10,
                          fill:'blue'
                        })
                        this.layer.add(editSequenceButton);
                        this.layer.draw()
                        editSequenceButton.on('click',()=>{
                          this.updateSeqNumber(indexToUpdate);
                        })
                      }
                    });
            }
        }

        })
      const canvas:any=this.stageCanvas.nativeElement
      this.stage = new Konva.Stage({
        container:canvas,
        width:this.customWidth,
        height:this.customHeight
      })
      this.layer=new Konva.Layer()
      this.stage.add(this.layer)
      this.imageUrl = environment.baseUrl+'images/' + imageRes;
      const imageObj = new Image();
       imageObj.onload = () => {
    this.initializeKonva(imageObj);

    this.drawStageContent(res[0].seatsData);
       }
       imageObj.src = this.imageUrl;
      this.enableZoom()
    })
  })

  }
  private drawStageContent(dataOfRect:any) {
    const shapes = dataOfRect
    shapes.forEach((shape:any) => {
      const reconstructedRect = Konva.Node.create(shape);
      reconstructedRect.draggable(false)
      this.layer.add(reconstructedRect);

    });

    this.layer.batchDraw()
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
  initializeKonva(imageObj: HTMLImageElement): void {
        this.backgroundImage = new Konva.Image({
          image: imageObj,
          width: this.customWidth,
          height: this.customHeight,
        });

        this.layer.add(this.backgroundImage);
        this.backgroundImage.moveToBottom()
        this.layer.draw();
      }
      updateSeqNumber(indexToUpdate:any) {
        // Find the object in getAllPoints array based on the index
        const pointToUpdate = this.getAllPoints[indexToUpdate];

        // Prompt the user to enter a new sequence number
        const newSequenceNumber = prompt("Enter new sequence number:", pointToUpdate.sequenceNo);

        // Check if the user entered a new sequence number and it's different from the current one
        if (newSequenceNumber !== null && newSequenceNumber !== pointToUpdate.sequenceNo) {
          // Update the sequence number in the object
          pointToUpdate.sequenceNo = Number(newSequenceNumber);

          // You can also update the UI or perform any other necessary actions here
          console.log("Updated sequence number:", pointToUpdate.sequenceNo);
        }
      }
      getSequenceNo(){

        let sequenceNo;
        let number;

        do {
          number = prompt("Please enter sequence number:");
        } while (number == null || number.trim() === ""); // Keep prompting until a non-empty input is provided

        sequenceNo = number;

         return sequenceNo;

      }
      seatHeight:any;
      seatWidth:any
    resetThePoint(){
      // I want that when i call the function the point that has the layout will shrink

    let data = {
      LayoutData:{layoutBorder:this.getAllPoints,
        pillarsData:this.pillarRectData,
        seatHeight:this.seatHeight,
        seatWidth:this.seatWidth,
      }
     }

  // this.locationService.addLayoutData(this.id,data).subscribe(res=>{
  //     this.proposalService.lockProposal(this.proposalId, { lockProposal:true })
  //           .subscribe((res:any) => {
  //           });
  //     // this.router.navigate(['/admin','location','location-list'])
  //   })
  console.log(data)

    }

}
