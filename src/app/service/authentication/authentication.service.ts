import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(
        private router: Router
    ) {}

    forceLogout = () => {
        Swal.fire({
            title: 'Forced Logout!',
            text: 'you have logged in from another device. Please login again to continue using this device',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        })
        localStorage.removeItem('auth-token');
        localStorage.removeItem('userName');
        this.router.navigate(['/login']);
    }

    handleAuthError = (err: any) => {
        if (err.error.Message === "Device is no longer Authenticated") {
            this.forceLogout();
        }
    }
}