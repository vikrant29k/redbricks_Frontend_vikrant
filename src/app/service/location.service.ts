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
            center: 'Sivaji Nagar',
            image: ['location-preview.png']
        },
        {
            location: 'Pune',
            center: 'Koregao Park',
            image: ['location-preview.png']
        },
        {
            location: 'Pune',
            center: 'Hadapsar',
            image: ['location-preview.png']
        },
        {
            location: 'Bangalor',
            center: 'Salarpuria',
            image: ['location-preview.png']
        },
        {
            location: 'Bangalor',
            center: 'Kharadi',
            image: ['location-preview.png']
        },
        {
            location: 'Delhi',
            center: 'Kharadi',
            image: ['location-preview.png']
        },
        {
            location: 'Bangalor',
            center: 'Beach',
            image: ['location-preview.png']
        },
        {
            location: 'Mumbai',
            center: 'Bandra',
            image: ['location-preview.png']
        },
        {
            location: 'Mumbai',
            center: 'Gurgao',
            image: ['location-preview.png']
        },
        {
            location: 'Delhi',
            center: 'Gurgao',
            image: ['location-preview.png']
        }
    ]
}