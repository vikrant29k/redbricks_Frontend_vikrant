import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
    providedIn: 'root'
})
export class LayoutDataService {

    private baseUrl: string = environment.baseUrl + 'layoutData/';

    selectedLocation!: string;
    selectedCenter!: string;
    selectedAddress!:string
    selectedFloor!:string;
    constructor(
        private headerService: HeaderService,
        private http: HttpClient,
        private toster: HotToastService
    ) { }

    drawAllLayout = (data:any) =>{
      let httpOptions = this.headerService.updateHeader();
      return this.http.post(this.baseUrl + 'viewLayout',data, httpOptions)
    }
    getLayout(id: string, data: any[]) {
      let httpOptions = this.headerService.updateHeader();
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const url = this.baseUrl + 'viewLayout/' + id + '/' + encodedData;

      return this.http.get(url, httpOptions);
    }
    deleteProposalLayout = (id: string) => {
      let httpOptions = this.headerService.updateHeader();
      return this.http.delete(this.baseUrl + 'deleteProposal/' + id, httpOptions).pipe(
          this.toster.observe({
              success: 'Proposal Deleted Successfully',
              loading: 'Deleting Proposal...',
              error: ({ error }) => `${error.Message}`
          })
      );
  }

}
