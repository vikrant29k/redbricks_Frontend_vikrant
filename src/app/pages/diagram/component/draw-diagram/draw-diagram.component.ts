import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import Konva from 'konva';
import { LayoutDataService } from 'src/app/service/layout data/layoutData.service';
@Component({
  selector: 'app-draw-diagram',
  templateUrl: './draw-diagram.component.html',
  styleUrls: ['./draw-diagram.component.scss']
})
export class DrawDiagramComponent implements AfterViewInit {
stage!:Konva.Stage;
layer!:Konva.Layer;
newLayer !: Konva.Layer;
shapes: any[] = [];
selectedShape: any | null = null;
  constructor(private route:Router,
    private dataSvaing:LayoutDataService
    ) { }
  getRandomColor():string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      width: 1080,
      container: 'container',
      height: 734
    });
    this.layer = new Konva.Layer({
      name: 'firstLayer'
    });
    this.newLayer = new Konva.Layer({
      name:'newLayer'
    })
    this.stage.add(this.layer);
    this.stage.add(this.newLayer);
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();

    const horizontalLinesCount = 3;
    const verticalLinesCount = 6;

    // Calculate horizontal dashed line spacing
    const horizontalSpacing = stageHeight / (horizontalLinesCount + 1);
    console.log(horizontalSpacing)
    // Create horizontal dashed lines
    for (let i = 1; i <= horizontalLinesCount; i++) {

      const dashLine = new Konva.Line({
        points: [0, i * horizontalSpacing, stageWidth, i * horizontalSpacing],
        stroke: 'black',
        strokeWidth: 2,
        draggable:true,
        dash: [5, 5], // This creates a dashed line
      });
      this.layer.add(dashLine);
    }

    // Calculate vertical dashed line spacing
    const verticalSpacing = stageWidth / (verticalLinesCount + 1);
    console.log(verticalSpacing)
    // Create vertical dashed lines
    for (let i = 1; i <= verticalLinesCount; i++) {
      const dashLine = new Konva.Line({
        points: [i * verticalSpacing, 0, i * verticalSpacing, stageHeight],
        stroke: 'black',
        strokeWidth: 2,
        dash: [5, 5], // This creates a dashed line
        draggable:true
      });
      this.layer.add(dashLine);
    }

    this.layer.draw();
this.layer.listening(false);
this.enableZoom()

  }

  createLPolygon() {
    const lShape = new Konva.Line({
      points: [0, 0, //start
              0, 200, //left bottom
              100, 200,//right bottom
              100, 115,//middle right
              115,100,
              250, 100,//middle
              250, 0],//middle top

      stroke: 'blue', // Stroke color
      strokeWidth: 1, // Stroke width
      closed: true, // Open polygon
      draggable:true,
      fill:this.getRandomColor(),
      opacity:0.7,
      // tension:0.3

    });

   this.newLayer.add(lShape)
   let transformer = new Konva.Transformer({
    nodes:[lShape]
   })

   transformer.attachTo(lShape)
   lShape.on('click',()=>{
    if (transformer.getNode() === lShape) {
      transformer.detach();
    } else {
      transformer.attachTo(lShape);
    }
    this.newLayer.draw();
  })
  this.newLayer.add(transformer)
  this.newLayer.draw()
  this.shapes.push({shape:lShape,name:'Polygon'});
  }
  createSquare() {
    const rect1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: 400,
      height: 350,
      fill:this.getRandomColor(),
      stroke:'black',
      strokeWidth:2,
      draggable: true,

    });
    this.newLayer.add(rect1)
    let transformer = new Konva.Transformer({
     node:rect1
    })

    transformer.attachTo(rect1)
  // Add the click event to toggle the transformer
  rect1.on('click', () => {
    if (transformer.getNode() === rect1) {
      transformer.detach();
    } else {
      transformer.attachTo(rect1);
    }
    this.newLayer.draw();
  });
  rect1.on('dblclick', () => {
    const clonedRect = rect1.clone();
    clonedRect.x(clonedRect.x() + 20); // Adjust the position of the clone
    let newTransform=new Konva.Transformer({
      node:clonedRect
    })
    newTransform.attachTo(clonedRect)
    this.newLayer.add(clonedRect);
    this.newLayer.add(newTransform)
    clonedRect.on('click', () => {
      if (newTransform.getNode() === clonedRect) {
        newTransform.detach();
      } else {
        newTransform.attachTo(clonedRect);
      }
      this.newLayer.draw();
    });
    this.newLayer.draw();
    this.shapes.push({shape:clonedRect,name:'Rect'})
  });
   this.newLayer.add(transformer)
   this.newLayer.draw()
   this.shapes.push({shape:rect1,name:'Rect'});

   }
   createCircle() {
    let circle = new Konva.Circle({
     x:0,
     y:0,
     radius:70,
     stroke:'black',
     strokeWidth:1,
     fill:this.getRandomColor(),
     draggable:true
    })
    this.newLayer.add(circle)
    let transformer = new Konva.Transformer({
     nodes:[circle]
    })

    transformer.attachTo(circle)
    circle.on('click', () => {
      if (transformer.getNode() === circle) {
        transformer.detach();
      } else {
        transformer.attachTo(circle);
      }
      this.newLayer.draw();
    });
   this.newLayer.add(transformer)
   this.newLayer.draw();
   this.shapes.push({shape:circle,name:'Circle'});

   }
   createSeat() {
    const lShape = new Konva.Line({
      points: [20, 0, //start
              0, 200, //left bottom
              20, 200,//right bottom
              40, 90,//middle right
              160,90,
              180, 200,//middle
              200, 200,
              180,0
            ],//middle top

      stroke: 'blue', // Stroke color
      strokeWidth: 1, // Stroke width
      closed: true, // Open polygon
      draggable:true,
      fill:this.getRandomColor(),
      // opacity:0.7,
      tension:0.1

    });

   this.newLayer.add(lShape)
   let transformer = new Konva.Transformer({
    nodes:[lShape]
   })

   transformer.attachTo(lShape)
   lShape.on('click',()=>{
    if (transformer.getNode() === lShape) {
      transformer.detach();
    } else {
      transformer.attachTo(lShape);
    }
    this.newLayer.draw();
  })
  lShape.on('dblclick', () => {
    const clonedRect = lShape.clone();
    clonedRect.x(clonedRect.x() + 20); // Adjust the position of the clone
    let newTransform=new Konva.Transformer({
      node:clonedRect
    })
    newTransform.attachTo(clonedRect)
    this.newLayer.add(clonedRect);
    this.newLayer.add(newTransform)
    clonedRect.on('click', () => {
      if (newTransform.getNode() === clonedRect) {
        newTransform.detach();
      } else {
        newTransform.attachTo(clonedRect);
      }
      this.newLayer.draw();
    });
    this.newLayer.draw();
    this.shapes.push({shape:clonedRect,name:'Rect'})
  });
  this.newLayer.add(transformer)
  this.newLayer.draw()
  this.shapes.push({shape:lShape,name:'Polygon'});
  }

   changeColor(selectedShape:Konva.Rect): void {
    if (selectedShape) {
      selectedShape.fill( this.getRandomColor()); // Change the fill color
      this.newLayer.draw();
    }
  }

saveDiagram(){
  const diagramState = this.shapes.map(shape => {
    return {
      type: shape.name,
      shape:shape.shape.attrs
    };
  });
  this.serializeData =diagramState
  console.log(this.serializeData)
}
serializeData:any[]=[]
loadDiagram(){

this.newLayer.destroy();
this.newLayer = new Konva.Layer({ name: 'newLayer' });
this.stage.add(this.newLayer);

const group = new Konva.Group();
this.serializeData.forEach((shapeData:any) => {
  console.log(shapeData,"HEIOLLLL")
  let newShape:any;

  switch (shapeData.type) {
    case 'Polygon':
      newShape = new Konva.Line(shapeData.shape);
      newShape.draggable(false)
      break;
    case 'Rect':
      newShape = new Konva.Rect(shapeData.shape);
      newShape.draggable(false)
      break;
    case 'Circle':
      newShape = new Konva.Circle(shapeData.shape);
      newShape.draggable(false)
      break;
  }
  group.add(newShape);

  // this.newLayer.add(newShape);


  // Add click and double-click event handlers as before
});
group.draggable(true)
this.newLayer.add(group);

let groupTransformer = new Konva.Transformer({
  nodes: [group],
});
this.newLayer.add(groupTransformer);
this.newLayer.draw();


}

checkDrawnSeat(){
  this.dataSvaing.setArray(this.serializeData)
  this.route.navigate(['/','admin','diagram','view-diagram'])
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
}
