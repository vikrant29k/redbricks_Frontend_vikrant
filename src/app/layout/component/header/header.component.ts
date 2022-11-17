import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/service/navigation service/navigation.service";
@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class LayoutHeaderComponent {

    menuOpen: boolean = false;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private navigate: NavigationService
    ) { }
    Back(){
        this.navigate.goBack();
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