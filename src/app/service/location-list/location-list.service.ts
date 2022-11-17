import { Injectable } from '@angular/core';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { LocalStorageService } from '../localstorage/localstrage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationListService {

  locationIdToUpdate:any;

  private baseUrl: string = environment.baseUrl + 'location/';

  private updateHeader = () => {
    let authToken: string = `${this.localStorage.getItem('auth-token')}`;
    let deviceType: string = this.deviceDetectorService.detectDevice();
    let headers: HttpHeaders = new HttpHeaders({
      'auth-token': authToken,
      'devicetype': deviceType
    });

    let httpOptions: any = {
      headers: headers
    }

    return httpOptions;

  }

  constructor(
    private localStorage: LocalStorageService,
    private deviceDetectorService: DeviceDetectorService,
    private http: HttpClient
  ) { }

  getAllLocation = () => {
    let httpOptions = this.updateHeader();
    return this.http.get(this.baseUrl + 'getAll', httpOptions);
  }

  addLocation = (data: any) => {
    let httpOptions = this.updateHeader();
    return this.http.post(this.baseUrl + 'create', data, httpOptions);
  }

  updateLocation = (data: any) => {
    let httpOptions = this.updateHeader();
    return this.http.post(this.baseUrl + 'update', data, httpOptions);
  }

  deleteLocation = (id: string) => {
    let httpOptions = this.updateHeader();
    return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions);
  }

  getLocationById = (id:string) => {
    let httpOptions = this.updateHeader();
    return this.http.get(this.baseUrl + 'getById/' + id, httpOptions);
  }
}