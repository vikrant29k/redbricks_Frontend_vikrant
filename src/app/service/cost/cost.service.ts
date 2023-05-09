import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";
import { HttpClient } from "@angular/common/http";
import { HotToastService } from "@ngneat/hot-toast"



@Injectable({
    providedIn: 'root'
})
export class CostService {

    baseUrl = environment.baseUrl + 'cost/';

    constructor(
        private http: HttpClient,
        private headerService: HeaderService,
        private toster: HotToastService
    ) { }

    getAllCosts = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
            this.toster.observe({
                success: 'Data Loaded Successfully',
                loading: 'Loading Data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }
    updateCosts = (data:any) => {
      let httpOptions = this.headerService.updateHeader();
      return this.http.post(this.baseUrl + 'update',data, httpOptions).pipe(
          this.toster.observe({
              success: 'Cost Updated Successfully',
              loading: 'Updating Cost...',
              error: ({ error }) => `${error.Message}`
          })
      );
  }
}
