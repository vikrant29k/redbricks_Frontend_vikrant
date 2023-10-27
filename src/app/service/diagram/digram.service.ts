import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';


@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  userIdToUpdate: any;

  private baseUrl: string = environment.baseUrl + 'diagram/';


  constructor(
    private http: HttpClient,
    private headerService: HeaderService,
    private toster: HotToastService
  ) { }



  saveDiagram= (data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.post(this.baseUrl + 'saveDiagram', data, httpOptions).pipe(
      this.toster.observe({
        success: 'Saved Successfully',
        loading: 'Saving...',
        error: ({ error }) => `${error.message}`
      })
    );
  }

  getDiagram=(diagramName:any)=>{
    let httpOptions = this.headerService.updateHeader()
    return this.http.get(this.baseUrl+'getDiagram/'+diagramName,httpOptions)
  }

}
