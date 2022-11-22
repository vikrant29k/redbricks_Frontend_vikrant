import { Injectable } from "@angular/core";
import { HotToastService } from "@ngneat/hot-toast";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private baseUrl = environment.baseUrl + 'profile/'

    constructor(
        private headerService: HeaderService,
        private toster: HotToastService,
        private http: HttpClient
    ) { }
    
    getUserProfile = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'get', httpOptions).pipe(
            this.toster.observe({
                success: 'Profile Data Loaded Successfully!',
                loading: 'Loading Profile Data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    updateUserProfile = (updatedProfileData: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'update', updatedProfileData, httpOptions).pipe(
            this.toster.observe({
                success: 'Profile Updated Successfully',
                loading: 'Updating User Profile...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }
}