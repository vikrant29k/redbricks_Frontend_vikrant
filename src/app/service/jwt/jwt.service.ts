import { Injectable } from "@angular/core";
import jwtDecode from "jwt-decode";


@Injectable({
    providedIn: 'root'
})
export class JWTService {

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
        return this.decodeToken().role;
    }
}