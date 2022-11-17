import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot,UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

    constructor(
        private AuthService: AuthenticationService,
        private router: Router
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        console.log('Route::', route);
        console.log('snapshot::',state)
        if (this.AuthService.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['/auth']);
        return false;
    }
}