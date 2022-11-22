import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HotToastService } from "@ngneat/hot-toast";
import { HeaderService } from "src/app/service/header/header.service";

@Injectable()
export class LogService {

    baseUrl = environment.baseUrl + 'logs/';

    constructor(
        private http: HttpClient,
        private toster: HotToastService,
        private headerService: HeaderService
    ){}

    getAllLogs = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'proposal-log',httpOptions).pipe(
            this.toster.observe({
                success: 'All Log Data Loaded Successfully',
                loading: 'Loading All Log data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }
}