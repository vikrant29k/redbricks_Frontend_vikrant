import { Component } from "@angular/core";
import { NavigationService } from "src/app/service/navigation service/navigation.service";

@Component({
    selector: 'pages-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent {
    constructor(
        private navigationService: NavigationService
    ) { }
    
    back = () => {
        this.navigationService.goBack();
    }
 }