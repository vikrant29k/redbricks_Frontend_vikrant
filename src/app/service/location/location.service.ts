import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private baseUrl: string = environment.baseUrl + 'location/';

    selectedLocation!: string;
    selectedCenter!: string;
    headerService: any;

    constructor(
        private header: HeaderService,
        private http: HttpClient
    ) { }

    getAllLocation = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions);
    }

    addLocation = (data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'create', data, httpOptions);
    }

    updateLocation = (data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'update', data, httpOptions);
    }

    deleteLocation = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions);
    }

    getLocationById = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getById/' + id, httpOptions);
    }



    locationData = [
        {
            location: 'Pune',
            center: 'Kharadi',
            image: ['location-preview.png']
        },
        {
            location: 'Pune',
            center: 'Shivaji Nagar',
            image: ['location-preview.png']
        },
        {
            location: 'Pune',
            center: 'Koregaon Park',
            image: ['location-preview.png']
        },
        {
            location: 'Pune',
            center: 'Hadapsar',
            image: ['location-preview.png']
        },
        {
            location: 'Hyderabad',
            center: 'Salarpuria',
            image: ['location-preview.png']
        },
        {
            location: 'Hyderabad',
            center: 'Indira Nagar',
            image: ['location-preview.png']
        },
        {
            location: 'Hyderabad',
            center: 'Frazer Town',
            image: ['location-preview.png']
        },
        {
            location: 'Mumbai',
            center: 'Bandra',
            image: ['location-preview.png']
        },
        {
            location: 'Mumbai',
            center: 'Boriwali',
            image: ['location-preview.png']
        },
        {
            location: 'Mumbai',
            center: 'Panwale',
            image: ['location-preview.png']
        },
        {
            location: 'Delhi',
            center: 'Canode palace',
            image: ['location-preview.png']
        },
        {
            location: 'Delhi',
            center: 'Mandoli',
            image: ['location-preview.png']
        }
    ]
}