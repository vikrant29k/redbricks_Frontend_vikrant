import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LayoutDataService {
shapeArray:any[]=[]
    constructor( ) { }
setArray(data:any){
  this.shapeArray=data
}
getArray(){
  return this.shapeArray
}

}
