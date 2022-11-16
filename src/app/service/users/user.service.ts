import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { LocalStorageService } from '../localstorage/localstrage.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userIdToUpdate: any;

  private baseUrl: string = environment.baseUrl + 'user/';


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
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    private localStorage: LocalStorageService
  ) { }

  getAllUser = () => {
    let httpOptions = this.updateHeader();
    return this.http.get(this.baseUrl + 'getAll', httpOptions);
  }

  updateUser = (data: any) => {
    let httpOptions = this.updateHeader();
    return this.http.post(this.baseUrl + 'update', data, httpOptions);
  }

  addUser = (data: any) => {
    let httpOptions = this.updateHeader();
    return this.http.post(this.baseUrl + 'create', data, httpOptions);
  }

  deleteUser = (id: string) => {
    let httpOptions = this.updateHeader();
    return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions);
  }

  getUserById = (id: string) => {
    let httpOptions = this.updateHeader();
    return this.http.get(this.baseUrl + 'getById/' + id, httpOptions);
  }

}