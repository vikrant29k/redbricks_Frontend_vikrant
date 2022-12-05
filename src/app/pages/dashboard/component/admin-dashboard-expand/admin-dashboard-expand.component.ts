import { Component, OnInit, Input } from '@angular/core';
import { DashboardAdminDashboard } from '../admin-dashboard/admin-dashboard.component';


@Component({
  selector: 'app-admin-dashboard-expand',
  templateUrl: './admin-dashboard-expand.component.html',
  styleUrls: ['./admin-dashboard-expand.component.scss']
})
export class AdminDashboardExpandComponent implements OnInit {
  @Input() cardData: any;
  showMe: boolean=false;
 city:any;
 data:any;
  constructor(private city_val:DashboardAdminDashboard) { }

  ngOnInit(): void {
    this.city = this.city_val.city 
 
  }
  clickHandler(){
    this.showMe = !this.showMe;
  }
  
}
