import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BorderDataService {
  private sharedData: any;
  private roomSelected:any[]=[]
  setData(data: any) {
    this.sharedData = data;
  }
  setDataforrooms(data: any){
    this.roomSelected=data
  }
getdataofRoom(){
  return this.roomSelected
}
  getData() {
    return this.sharedData;
  }
}
