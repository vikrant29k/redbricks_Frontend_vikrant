import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { Router } from "@angular/router";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

@Component({
    selector: 'admin-layout-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class AdminLayoutSidebarComponent {

    @Output() drawerClicked = new EventEmitter
    // menuOpen: boolean = false;

    logExpanded: boolean = false;
    userExpanded: boolean = false;
    locationExpanded: boolean = false;
    brokerExpand: boolean = false;

    expandAccording = (title?: string) => {
        switch (title) {
            case 'log':
                this.logExpanded = !this.logExpanded;
                this.userExpanded = false;
                this.locationExpanded = false;
                this.brokerExpand = false;
                break;
            
            case 'user':
                this.userExpanded = !this.userExpanded;
                this.logExpanded = false;
                this.locationExpanded = false;
                this.brokerExpand = false;
                break;
            
            case 'location':
                this.locationExpanded = !this.locationExpanded;
                this.logExpanded = false;
                this.userExpanded = false;
                this.brokerExpand = false;
                break;
            
            case 'broker':
                this.brokerExpand = !this.brokerExpand;
                this.locationExpanded = false;
                this.logExpanded = false;
                this.userExpanded = false;
                break;
        
            default:
                this.logExpanded = false;
                this.userExpanded = false;
                this.locationExpanded = false;
                this.brokerExpand = false;
                this.drawerClicked.emit();
                break;
        }
    }

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) { }

    logOut = () => {
        this.authService.logOut().subscribe((result: any) => {
            if (result.Message === 'user logout sucessfully!') {
                localStorage.removeItem('auth-token');
                this.router.navigate(['/auth']);
            }
        });
    }
}