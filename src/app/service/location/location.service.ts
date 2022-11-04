import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    selectedLocation!: string;
    selectedCenter!: string;

    constructor() { }

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
            location: 'Hydrabad',
            center: 'Salarpuria',
            image: ['location-preview.png']
        },
        {
            location: 'Hydrabad',
            center: 'Indira Nagar',
            image: ['location-preview.png']
        },
        {
            location: 'Hydrabad',
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