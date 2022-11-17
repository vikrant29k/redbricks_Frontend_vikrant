import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { JWTService } from "../jwt/jwt.service";


@Injectable({
    providedIn: 'root'
})
export class SalesAuthGuardService implements CanActivate {

    constructor(
        private jwtService: JWTService,
        private router: Router
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.jwtService.getUserRole() === 'sales') {
            return true;
        }
        this.router.navigate(['/admin']);
        return false;

    }
}