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
  centers:any;
  data:any;
  constructor(private city_val:DashboardAdminDashboard) { }

  ngOnInit(): void {
    this.city = this.city_val.city ;
    // this.centers=this.city_val.city.city_center;
  }
  clickHandler(){
    this.showMe = !this.showMe;
  }

}
