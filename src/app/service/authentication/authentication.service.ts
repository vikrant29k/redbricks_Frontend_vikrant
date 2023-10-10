import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { HotToastService } from "@ngneat/hot-toast";
import { HeaderService } from "../header/header.service";
import  FingerprintJS from "@fingerprintjs/fingerprintjs";
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    baseUrl: string = environment.baseUrl + 'auth/'

    constructor(
        private router: Router,
        private headerService: HeaderService,
        private http: HttpClient,
        private toster: HotToastService
    ) { }
     getBrowserFingerprint = async (): Promise<string> => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      // Get the unique fingerprint ID
      const fingerprint = result.visitorId;

      return fingerprint;
    };
    login = async (loginData: any) => {
        let httpOptions = this.headerService.updateHeader();
        // let deviceId = await this.electronApiService.getMacAddress();
        let deviceId =await this.getBrowserFingerprint();
        // console.log(deviceId);
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
        let token = sessionStorage.getItem('token');
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
        // localStorage.removeItem('auth-token');
        sessionStorage.removeItem('token')
        this.router.navigate(['/auth']);
    }

    handleAuthError = (err: any) => {
        if (err.error.Message === "Device is no longer Authenticated") {
            this.forceLogout();
        }
    }
}
