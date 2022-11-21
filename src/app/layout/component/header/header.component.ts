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
    ) { }
    ngDoCheck(): void {
    }
    logOut = () => {
        this.authService.logOut().subscribe((result: any) => {
            if (result.Message === 'user logout sucessfully!') {
                localStorage.removeItem('auth-token');
                this.router.navigate(['/auth']);
            }
        });
    }
}