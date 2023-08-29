import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private baseUrl: string = environment.baseUrl + 'location/';

    selectedLocation!: string;
    selectedCenter!: string;
    selectedAddress!:string
    selectedFloor!:string;
    locationId!:string;
    constructor(
        private headerService: HeaderService,
        private http: HttpClient,
        private toster: HotToastService
    ) { }

    getAllLocation = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
            // this.toster.observe({
            //     success: 'All Location Data Loaded successfully',
            //     loading: 'Loading Location Data...',
            //     error: ({ error }) => `${error.Message}`
            // })
        );
    }

    addRackValue = (data:any) =>{
      let httpOptions = this.headerService.updateHeader();
      return this.http.post(this.baseUrl + 'updateRackValue',data, httpOptions).pipe(
          this.toster.observe({
              success: 'Rack Value Added successfully',
              loading: 'Adding Rack Value...',
              error: ({ error }) => `${error.Message}`
          })
      );
    }

    addLocation = (data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'create', data, httpOptions).pipe(
            this.toster.observe({
                success: 'Location Added Successfully',
                loading: 'Adding location...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    updateLocation = (Id: string,data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'update/'+ Id, data, httpOptions).pipe(
            this.toster.observe({
                success: 'Location Updated Successfully',
                loading: 'Updating location...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    deleteLocation = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions).pipe(
            this.toster.observe({
                success: 'Location Deleted Successfully',
                loading: 'Deleting Location...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    getLocationById = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getById/' + id, httpOptions).pipe(
            this.toster.observe({
                success: 'Location Data Loaded Successfully',
                loading: 'Getting Location Data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }
    
    getImageById(id: any): Observable<any> {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getImage/' + id, {
          ...httpOptions,
          responseType: 'text' // Set responseType to 'text' to prevent automatic parsing
        });
      }
      getBorderData(id: any): Observable<any> {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getBorderData/' + id, httpOptions);
      }
    getLocationList = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getLocationList', httpOptions).pipe(
            // this.toster.observe({
            //     success: 'Location-list Loaded Successfully',
            //     loading: 'Getting Location-list...',
            //     error: ({ error }) => `${error.Message}`
            // })
        );
    }

    getCentersInLocation = (location: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getCentersInLocation/' + location, httpOptions).pipe(
            // this.toster.observe({
            //     success: 'Centers Loaded Successfully',
            //     loading: 'Loading Centers...',
            //     error: ({ error }) => `${error.Message}`
            // })
        );
    }

    getFloorsInLocation = (floor: string) => {
      let httpOptions = this.headerService.updateHeader();
      return this.http.get(this.baseUrl + 'getFloorsInLocation/' + floor, httpOptions).pipe(

      );
  }

    getRentData = (data:any)=>{
      let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'getRentSheet', data , httpOptions).pipe(
            this.toster.observe({
                success: 'Centers Loaded Successfully',
                loading: 'Loading Centers...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    addLayoutData = (id:string,data:any)=>{
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'addLayout/'+id,data,httpOptions).pipe(
            this.toster.observe({
                success: 'Layout Data Added Successfully',
                loading:'Adding Layout Data...',
                error:({error})=>`${error.Message}`
            })
        );
    }

    getAllImageOfCenter = (id:string) =>{
      let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl+'getCenterImages/'+id,httpOptions)
    }

}