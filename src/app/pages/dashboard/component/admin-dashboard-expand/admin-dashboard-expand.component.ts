import { Component, OnInit, Input } from '@angular/core';
import { DashboardAdminDashboard } from '../admin-dashboard/admin-dashboard.component';
import { MatDialog } from "@angular/material/dialog";
import { ShowStatsComponent } from './show-stats/show-stats.component';

// import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
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
    // console.log(this.cardData,"sadasdasd",this.city)
    // this.centers=this.city_val.city.city_center;
  }

  openDialog(center:any){
    this.dialog.open(ShowStatsComponent, {
      width: '1000px',
      height:' 615px',
      panelClass:'stats_dialog',
      data: { center: this.cardData.centers[center]},
    });
  }
  clickHandler(){
    this.showMe = !this.showMe;
  }
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#fc5858', '#19d863', '#fdf57d'],
    borderColor: ['rgba(252, 235, 89, 0.2)', 'rgba(77, 152, 202, 0.2)', 'rgba(241, 107, 119, 0.2)']
  }];
  // public pieChartOptions: ChartOptions<'pie'>|any = {
  //   responsive: false,
  //   color:'white',
  //   backgroundColor: ['#fc5e03', '#871313', '#fdf57d']
  // };
  public pieChartLabels = [ [ 'Sold' ], ['Remaining'] ];

  public pieChartDatasets:any
  public pieChartLegend = true;
  public pieChartPlugins = [];
}
