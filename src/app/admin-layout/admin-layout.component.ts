import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

    @ViewChild('drawer') drawer!: MatDrawer;

    closeDrawer = () => {
        this.drawer.close();
    }


}
