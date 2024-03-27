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
    return this.http.get(this.baseUrl + 'userData/1', httpOptions);
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
  getSaleData(id:any){
    return this.http.get('http://192.168.29.203:3000/salesChart/getSalesPersonProposals/'+id)
  }

  getCenters(lcoationName:any){
    const httpOptions  = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'centers/'+ lcoationName, httpOptions )
  }
  getFloorData(locationName:any,centerName:any){
    const httpOptions  = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'floorData/'+ locationName+'/'+centerName, httpOptions )
  }

  getProposalData = (id:any) => {
    const httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'recentProposalData/'+id, httpOptions);
  };

  getUserListArray = () =>{
    let httpOptions = this.headerService.updateHeader()
    return this.http.get(this.baseUrl+'userData/1',httpOptions)
  }
  getSelsProposalCount = (id:any) =>{
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl+'salesProposalCount/'+id,httpOptions)

  }
}
