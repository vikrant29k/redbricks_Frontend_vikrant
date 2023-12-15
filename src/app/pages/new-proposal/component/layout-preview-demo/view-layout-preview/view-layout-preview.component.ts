import { Component, OnInit,Inject,ViewChild,ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import Konva from 'konva';
export interface DialogData {
 currentShape:any,
 proposalId:any
}
@Component({
  selector: 'app-view-layout-preview',
  templateUrl: './view-layout-preview.component.html',
  styleUrls: ['./view-layout-preview.component.scss']
})
export class ViewLayoutPreviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewLayoutPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private proposalService:ProposalService
  ) { }

  ngOnInit(): void {
    console.log(this.data.currentShape)
  }
  @ViewChild('stageCanvas', { static: true }) stageCanvas!: ElementRef<HTMLCanvasElement>;
  stage!:Konva.Stage
  customWidth = 1080;
  customHeight = 734;
  ngAfterViewInit(): void {
    if (this.data.currentShape) {
      this.stage = this.data.currentShape;

      this.drawStageContent();
    }
  }
  private drawStageContent() {
    const layers = this.stage?.children;
    const canvas:any = this.stageCanvas.nativeElement;

    if (!layers || !canvas) {
      return;
    }

    const newStage = new Konva.Stage({
      container: canvas,
      width: this.customWidth,
      height: this.customHeight,
    });

    layers.forEach((layer: Konva.Layer) => {
      const shapes = layer.children;

      if (shapes) {
        const newLayer = new Konva.Layer();

        shapes.forEach((shape) => {
          const clonedShape = shape.clone();
          clonedShape.draggable(true);
          if (!(clonedShape instanceof Konva.Image)) {
              clonedShape.name('Rects')
          }
          // Add click event listener to each shape
          clonedShape.on('click', () => {
            if (!(clonedShape instanceof Konva.Image)) {
              // Add click event listener to each shape
              clonedShape.on('click', () => {
                this.handleShapeClick(clonedShape);
              });
            }

          });

          newLayer.add(clonedShape);
        });

        // Add the new layer to the new stage
        newStage.add(newLayer);
      }
    });

    newStage.draw();
    this.enableZoom(newStage)
    this.stage=newStage
  }
  private selectedShape: Konva.Shape | null = null;

  handleShapeClick(shape: Konva.Shape): void {
    shape.stroke('black');
    shape.strokeWidth(2)
    if (!this.selectedShape) {
      // If no shape is selected, store the clicked shape as the selected shape
      this.selectedShape = shape;
    } else {
      // If a shape is already selected, swap their positions
      this.swapShapePositions(this.selectedShape, shape);
      this.selectedShape = null; // Reset selected shape
    }
  }
  private swapShapePositions(shape1: Konva.Shape, shape2: Konva.Shape): void {
    const shape1Position = shape1.position();
    const shape2Position = shape2.position();

    shape1.position(shape2Position);
    shape2.position(shape1Position);

    // Redraw the stage
    this.stage.batchDraw();
  }
  enableZoom(stage:Konva.Stage): void {
    const scaleBy = 1.1; // Adjust the scale factor as needed
    stage.on('wheel', (e) => {
      e.evt.preventDefault();
      const oldScale = stage.scaleX();
      const pointer: any = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1; // Adjust the direction for standard zoom behavior

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
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



  hideName(){
    let roomNames=this.stage.find('.room-names');
    roomNames.forEach(room=>{
      if(room.visible()){
        room.hide();
      }else{
        room.show()
      }

    })
  }
  saveImage(){
    const image=this.stage.toDataURL()
    const seatData:any=this.stage.find('.Rects')
    debugger
    let data={
      image:String(image),
      // drawnSeats:this.drawnSeats,
      drawnSeats:seatData
    }
    this.proposalService.saveImage(this.data.proposalId,data).subscribe(res=>{
      this.dialogRef.close(true)
          // console.log(res)
        })
  }
}
