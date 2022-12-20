import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { JWTService } from "../jwt/jwt.service";


@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {
user:any;
    constructor(
        private jwtService: JWTService,
        private router: Router
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (['admin', 'sales head'].includes(this.jwtService.getUserRole())) {
            
            return true;
        }
        this.router.navigate(['/sales']);
        return false;

    }
}