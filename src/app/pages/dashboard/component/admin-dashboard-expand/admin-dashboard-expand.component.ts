import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { DashboardAdminDashboard } from '../admin-dashboard/admin-dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowStatsComponent } from './show-stats/show-stats.component';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
declare var google: any;
// import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
@Component({
  selector: 'app-admin-dashboard-expand',
  templateUrl: './admin-dashboard-expand.component.html',
  styleUrls: ['./admin-dashboard-expand.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('floorin', style({ transform: 'translate(0)',background: 'rgb(228 226 226)', width:'82.5vw',height: '75vh',position: 'relative',top: '-19.6rem', 'border-radius':' 15px ','z-index':1,left:'-1.3rem'})),
      state('floorout', style({ transform: 'translate(0,0)',display:'none', width:'0rem', height:'0rem',position: 'relative',top: '-19.6rem',left:'-1.3rem' })),
      transition('floorin => floorout', animate('0.6s ease-in-out')),
      transition('floorout => floorin', animate('0.6s ease-in-out')),
    ]),
    trigger('dataInOut', [
      state('in', style({ transform: 'translate(0)',background: 'rgb(205 82 88)', width:'82.5vw',height: '76vh',position: 'relative',top: '-54.6rem',left:'-1rem', 'border-radius':' 15px '})),
      state('out', style({ transform: 'translate(0,0)',display:'none', width:'0rem', height:'0rem',position: 'relative',top: '-55.6rem',left:'-1rem',  })),
      transition('in => out', animate('0.6s ease-in-out')),
      transition('out => in', animate('0.6s ease-in-out')),
    ]),
  ],
})
export class AdminDashboardExpandComponent implements OnInit {

  floorHover: any = false;
  selectedCenter: string | null = null;
  @Input() cardData: any;
  showMe: boolean = false;
  city: any;
  centers: any;
  data: any;
  mobileStyles: any = {};
  constructor(
    private dialog: MatDialog,
    private dashboardService: DashboardService
  ) {}
  // Initialize an empty array to store the floors data
  allFloors: any[] = [];
  centerDataWithFloors: any[] = [];
  // Iterate through each center in cardData.centers and extract the floors data

  // Now, you can send allFloors to your template
  centerList: any[] = [];
  centerName: any;
  ngOnInit(): void {
    this.dashboardService.getCenters(this.cardData).subscribe((res: any) => {
      this.centerList = res.centers;
      // console.log(res)

    });



  }




  floorData: any[] = [];
  closeFloor() {
    this.selectedCenter = null;
  }
  getFloorData(centerName: any) {
    this.dashboardService
      .getFloorData(this.cardData, centerName)
      .subscribe((res: any) => {
        console.log(res);
        this.centerName = centerName;
        this.floorData = res.data;
        this.selectedCenter = centerName;
      });
  }
  details: string | null = null;

  currentValue: any;
  rackValue: any;
  bookingPriceUptilNow: any;
  currentSeatPrice: any;
  totalNoOfWorkStation!: number;
  selectedNoOfSeats!: number;
  // futureRackRate:any

  @ViewChild('pieChart') pieChart: any | ElementRef;


  detailFloor(floor: any, dataOfFloor: any) {
    this.clearChart();
    this.details = floor;
    this.totalNoOfWorkStation = dataOfFloor.totalNoOfWorkstation;
    this.currentValue = dataOfFloor.systemPrice;
    this.rackValue = dataOfFloor.rackRate;
    this.bookingPriceUptilNow = dataOfFloor.bookingPriceUptilNow;
    this.currentSeatPrice = dataOfFloor.currentRackRate;
    this.selectedNoOfSeats = dataOfFloor.selectedNoOfSeats;
    // console.log(dataOfFloor);

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }
  closeFloordetails() {
    this.details = null;

    // console.log(this.chartDrawn);
  }
  openDialog(center: any) {
    this.dialog.open(ShowStatsComponent, {
      width: '1000px',
      height: ' 615px',
      panelClass: 'stats_dialog',
      data: { center: this.cardData.centers[center] },
    });
  }
  clickHandler() {
    this.showMe = !this.showMe;
  }

  chartTitle: any;
  chartDrawn = false;
  drawChart = () => {
    const data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Remaining', this.totalNoOfWorkStation - this.selectedNoOfSeats],
      ['Sold', this.selectedNoOfSeats],
    ]);

    const options: any = {
      title: this.chartTitle,
      titleTextStyle: {
        color: 'white', // Change the color of the title here
        fontSize: 25, // Optional: Adjust the font size of the title
        bold: true, // Optional: Set the title to bold
      },

      backgroundColor: 'rgb(205, 82, 88)',
      colors: ['#b0022d', '#ed8882'], // Set the slice colors here

      is3D: true,
      chartArea: { width: '90%', height: '90%' },
    };

    const chart = new google.visualization.PieChart(
      this.pieChart.nativeElement
    );

    chart.draw(data, options);
    this.chartDrawn = true;
    // console.log(this.chartDrawn);
  };
  clearChart = () => {
    if (this.chartDrawn) {
      // Clear the chart by removing its contents
      const chartContainer = this.pieChart.nativeElement;
      chartContainer.innerHTML = '';

      // Reset the flag
      this.chartDrawn = false;
    }
  };
}
