import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
    providedIn: 'root'
})
export class LogService {

    baseUrl = environment.baseUrl + 'logs/';

    constructor(
        private http: HttpClient,
        private toster: HotToastService
    ){}

    getAllLogs = () => {
        return this.http.get(this.baseUrl + 'proposal-log').pipe(
            this.toster.observe({
                success: 'All Log Data loaded Successfully',
                loading: 'Loading All Log data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }
}