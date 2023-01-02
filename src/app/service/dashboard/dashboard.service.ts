import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl: string = environment.baseUrl + 'dashboard/';
  constructor(private headerService: HeaderService, private http: HttpClient) {}
  getUserData = () => {
    const httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'userData', httpOptions);
  };
  getLocationData = () => {
    const httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'locationData', httpOptions);
  };
  getRecentProposal = () => {
    const httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'recentProposal', httpOptions);
  };
  getCoflicts = () => {
    const httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'proposalWithConflict', httpOptions);
  };
}
