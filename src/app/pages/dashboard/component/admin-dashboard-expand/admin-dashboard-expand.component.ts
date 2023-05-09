import { Component, OnInit, Input } from '@angular/core';
import { DashboardAdminDashboard } from '../admin-dashboard/admin-dashboard.component';
import { MatDialog } from "@angular/material/dialog";
import { ShowStatsComponent } from './show-stats/show-stats.component';


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
  constructor(private city_val:DashboardAdminDashboard, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.city = this.city_val.city ;
    console.log(this.cardData,"sadasdasd",this.city)
    // this.centers=this.city_val.city.city_center;
  }

  openDialog(center:any){
    this.dialog.open(ShowStatsComponent, {
      width: '800px',
      height: '566px',
      data: { center: this.cardData.centers[center]},
    });
  }
  clickHandler(){
    this.showMe = !this.showMe;
  }

}
