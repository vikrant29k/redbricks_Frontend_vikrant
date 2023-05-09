import { Injectable, EventEmitter  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeaderService } from "../header/header.service";
import { HttpClient } from "@angular/common/http";
import { HotToastService } from "@ngneat/hot-toast"

@Injectable({
  providedIn: 'root'
})
export class CalculationDataService {
  public objectValueUpdated: EventEmitter<any> = new EventEmitter<any>();

  public objectValue: any;
  // public rentValue:EventEmitter<number> = new EventEmitter<number>();
  // public camValue:EventEmitter<number> = new EventEmitter<number>();

  // baseUrl = environment.baseUrl + 'cost/';

  constructor( private http: HttpClient,
               private headerService: HeaderService,
               private toster: HotToastService) {
                console.log(this.objectValueUpdated,"both value from services")

  }
  // getValueAndcalculate(){

  // }
  // getLocation(message: string) {
  //   let httpOptions = this.headerService.updateHeader();
  //   return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
  //     this.toster.observe({
  //         success: 'Cost Data Loaded Successfully',
  //         loading: 'Loading Cost Data...',
  //         error: ({ error }) => `${error.Message}`
  //     })
  // )
  // }
 }
