import { Component, OnInit } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BorderDataService } from '../../../module/service/border-data.service';
import Konva from 'konva';
import * as imageSize from '../seat-draw/imageFile.json'
import * as roomsData from '../seat-draw/roomCountsData.json'
export interface RoomData {
  [key: string]: {
    count: number;
    color: string;
  };
}
export interface ImageData{
  [key: string]: {
    path:string,
    width: number;
    height: number;
  };
}
@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {
  roomsDataObject: RoomData = roomsData;
  imageSizeData: ImageData = imageSize;
  stage!: Konva.Stage|any;
  layer!: Konva.Layer;
  customWidth = 1080;
  customHeight = 734;
  imageUrl:any;

  constructor(private routeActive:ActivatedRoute,
               private locationService: LocationService,
               private proposalService: ProposalService,
               private borderDataService:BorderDataService
               ) { }
id!:string
borderData:any
selectedRoomData:any[]=[]
ngOnInit(): void {
  this.id = this.routeActive.snapshot.params['Id'];
  this.borderData=this.borderDataService.getData()
  this.selectedRoomData=this.borderDataService.getdataofRoom()
  console.log(this.selectedRoomData)
  this.proposalService.getProposalById(this.id).subscribe((res:any)=>{

    this.locationService.getImageById(res[0].locationId).subscribe(
      (imageUrl) => {
        this.imageUrl = environment.baseUrl+'images/' + imageUrl;
        const imageObj = new Image();
    imageObj.onload = () => {
      this.initializeKonva(imageObj);
      this.enableZoom();

      let border = new Konva.Line({
        points:this.borderData,
        closed: true,
        fill: 'grey',
        stroke: 'black',
        strokeWidth: 1.5
      });
      this.layer.add(border)
      this.layer.draw()
      // this.zoomToBorder();
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
newLayerForMovingObjects!:Konva.Layer;
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
  this.newLayerForMovingObjects = new Konva.Layer({
    name:'movingLayer'
  })
  this.stage.add(this.newLayerForMovingObjects)
  this.backgroundImage = new Konva.Image({
    image: imageObj,
    width: this.customWidth,
    height: this.customHeight,
  });

  this.layer.add(this.backgroundImage);
  this.layer.draw();
}
//for Zooming REQUIRED
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
//reset the zoom REQUIRED
resetZoomAndPosition(): void {
  // Set the initial scale and position values as per your original configuration
  const initialScale = 1;
  const initialPosition = { x: 0, y: 0 };

  this.stage.scale({ x: initialScale, y: initialScale });
  this.stage.position(initialPosition);
  this.stage.batchDraw();
}



}
