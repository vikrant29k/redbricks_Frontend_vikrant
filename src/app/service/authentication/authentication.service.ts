import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { ElectronApiService } from "../electron-api/electron-api.service";
import { environment } from "src/environments/environment";
import { HotToastService } from "@ngneat/hot-toast";
import { HeaderService } from "../header/header.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    baseUrl: string = environment.baseUrl + 'auth/'

    constructor(
        private router: Router,
        private headerService: HeaderService,
        private electronApiService: ElectronApiService,
        private http: HttpClient,
        private toster: HotToastService
    ) { }
    
    login = async (loginData: any) => {
        let httpOptions = this.headerService.updateHeader();
        let deviceId = await this.electronApiService.getMacAddress();
        console.log(deviceId);
        loginData = { ...loginData, deviceId: deviceId };
        return this.http.post(this.baseUrl + 'login', loginData, httpOptions).pipe(
            this.toster.observe({
                success: 'Login Successfull!',
                loading: 'Logging In',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    logOut = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'logout', httpOptions).pipe(
            this.toster.observe({
                success: 'Logout Successfull',
                loading: 'Loading...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    isAuthenticated = (): boolean => {
        let token = localStorage.getItem('auth-token');
        if (token) {
            return true;
        }
        return false;
    }

    forceLogout = () => {
        Swal.fire({
            title: 'Forced Logout!',
            text: 'You have logged in from another device. Please login again to continue using this device',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        })
        localStorage.removeItem('auth-token');
        this.router.navigate(['/auth']);
    }

    handleAuthError = (err: any) => {
        if (err.error.Message === "Device is no longer Authenticated") {
            this.forceLogout();
        }
    }
}