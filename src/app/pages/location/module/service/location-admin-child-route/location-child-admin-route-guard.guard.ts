import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class LocationAdminChildRouteGuard implements CanActivate {

    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let currentRoute = state.url.split('/')[1];
        if (currentRoute === 'admin') {
            return true;
        }
        this.router.navigate(['/sales/location']);
        return false;

    }
}