import { Component, OnInit, Input } from '@angular/core';
import { DashboardAdminDashboard } from '../admin-dashboard/admin-dashboard.component';
import { MatDialog } from "@angular/material/dialog";
import { ShowStatsComponent } from './show-stats/show-stats.component';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

// import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
@Component({
  selector: 'app-admin-dashboard-expand',
  templateUrl: './admin-dashboard-expand.component.html',
  styleUrls: ['./admin-dashboard-expand.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('floorin', style({ transform: 'translate(0)',background: 'rgb(228 226 226)', width:'inherit',height: '31rem',position: 'relative',top: '-8.1rem', 'border-radius':' 30px '})),
      state('floorout', style({ transform: 'translate(0,0)',display:'none', width:'0rem', height:'0rem',position: 'relative',top: '-8.1rem' })),
      transition('floorin => floorout', animate('0.6s ease-in-out')),
      transition('floorout => floorin', animate('0.6s ease-in-out')),
    ]),
    trigger('dataInOut', [
      state('in', style({ transform: 'translate(0)',background: 'rgb(205 82 88)', width:'97%',height: '26.5rem',position: 'relative',top: '-35.5rem',left:'1rem', 'border-radius':' 30px '})),
      state('out', style({ transform: 'translate(0,0)',display:'none', width:'0rem', height:'0rem',position: 'relative',top: '-35.5rem',left:'1rem',  })),
      transition('in => out', animate('0.6s ease-in-out')),
      transition('out => in', animate('0.6s ease-in-out')),
    ]),
  ],
})

export class AdminDashboardExpandComponent implements OnInit {
  floorHover:any=false
  selectedCenter: string | null = null;
  @Input() cardData: any;
  showMe: boolean=false;
  city:any;
  centers:any;
  data:any;
  constructor(private dialog:MatDialog,
     private dashboardService:DashboardService
     ) { }
// Initialize an empty array to store the floors data
allFloors:any[] = [];
centerDataWithFloors:any[] = [];
// Iterate through each center in cardData.centers and extract the floors data

// Now, you can send allFloors to your template
centerList:any[]=[]
centerName:any;
  ngOnInit(): void {
    this.dashboardService.getCenters(this.cardData).subscribe((res:any)=>{
      this.centerList=res.centers
      // console.log(res)
    })

  }
  floorData:any[]=[];
  closeFloor(){
    this.selectedCenter=null
  }
getFloorData(centerName:any){
  this.dashboardService.getFloorData(this.cardData,centerName).subscribe((res:any)=>{
    console.log(res)
    this.centerName=centerName
    this.floorData=res.data
    this.selectedCenter = centerName;
  })
}
details: string | null = null;

detailFloor(floor:any){
this.details=floor
}
closeFloordetails(){
  this.details=null
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
