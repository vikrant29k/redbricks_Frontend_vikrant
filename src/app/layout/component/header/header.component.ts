import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { Router, RouterStateSnapshot } from "@angular/router";
import { NavigationService } from "src/app/service/navigation service/navigation.service";
import { DoCheck } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class LayoutHeaderComponent implements DoCheck{

    menuOpen: boolean = false;
    hideBackButton: boolean = false;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private navigate: NavigationService,
    ) {

     }
    ngDoCheck(): void {
      window.addEventListener('beforeunload', this.onBeforeUnload);
    }


    onBeforeUnload = (): void => {
      // Send a request to the backend to remove the device ID
      this.logOut();
    }
    logOut = () => {
        this.authService.logOut().subscribe((result: any) => {
            if (result.Message === 'user logout sucessfully!') {
                // localStorage.removeItem('auth-token');
                sessionStorage.removeItem('token');
                this.router.navigate(['/auth']);
            }
        });
    }
}
