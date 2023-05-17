import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private baseUrl: string = environment.baseUrl + 'location/';

    selectedLocation!: string;
    selectedCenter!: string;
    selectedAddress!:string
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



    // locationData = [
    //     {
    //         location: 'Pune',
    //         center: 'Kharadi',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Pune',
    //         center: 'Shivaji Nagar',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Pune',
    //         center: 'Koregaon Park',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Pune',
    //         center: 'Hadapsar',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Hyderabad',
    //         center: 'Salarpuria',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Hyderabad',
    //         center: 'Indira Nagar',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Hyderabad',
    //         center: 'Frazer Town',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Mumbai',
    //         center: 'Bandra',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Mumbai',
    //         center: 'Boriwali',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Mumbai',
    //         center: 'Panwale',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Delhi',
    //         center: 'Canode palace',
    //         image: ['location-preview.png']
    //     },
    //     {
    //         location: 'Delhi',
    //         center: 'Mandoli',
    //         image: ['location-preview.png']
    //     }
    // ]
}
