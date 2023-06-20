import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl: string = environment.baseUrl + 'report/';


  constructor(
    private http: HttpClient,
    private headerService: HeaderService,
    private toster: HotToastService
  ) { }

  generateReport = (data:String) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.post(this.baseUrl + '/generateReport',data, httpOptions).pipe(
      this.toster.observe({
        success: 'Report Generated Successfully',
        loading: 'Generating Report...',
        error: ({ error }) => `${error.Message}`
      })
    );
  }
}
