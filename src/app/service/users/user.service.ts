import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userIdToUpdate: any;

  private baseUrl: string = environment.baseUrl + 'user/';


  constructor(
    private http: HttpClient,
    private headerService: HeaderService,
    private toster: HotToastService
  ) { }

  getAllUser = () => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'getAll', httpOptions);
  }

  updateUser = (data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.post(this.baseUrl + 'update', data, httpOptions);
  }

  addUser = (data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.post(this.baseUrl + 'create', data, httpOptions).pipe(
      this.toster.observe({
        success: 'User Created Successfully',
        loading: 'Creating User...',
        error: ({ error }) => `${error.Message}`
      })
    );
  }

  deleteUser = (id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions).pipe(
      this.toster.observe({
        success: 'User Deleted Successfully',
        loading: 'Deleting User...',
        error: ({ error }) => `${error.Message}`
      })
    );
  }

  getUserById = (id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'getById/' + id, httpOptions);
  }

  getSalesHead = () => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'getSalesHead', httpOptions);
  }

}