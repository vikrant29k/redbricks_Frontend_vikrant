import { Injectable } from "@angular/core";
import jwtDecode from "jwt-decode";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class JWTService {

    constructor(
        private router: Router
    ){}

    private getToken = () => {
        let token: string = `${localStorage.getItem('auth-token')}`;
        return token;
    }

    private decodeToken = (): any => {
        let token: string = this.getToken();
        let decode = jwtDecode(token);
        return decode;
    }

    getUserRole = () => {
        if (this.decodeToken().role) {
            // console.log(this.decodeToken().role);
            return this.decodeToken().role;
            
        }
        else {
            localStorage.removeItem('auth-token');
            this.router.navigate(['/auth']);
        }
    }
}