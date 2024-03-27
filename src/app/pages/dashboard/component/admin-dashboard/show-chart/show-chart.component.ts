import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './../../../../../service/dashboard/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var google: any;

@Component({
  selector: 'app-show-chart',
  templateUrl: './show-chart.component.html',
  styleUrls: ['./show-chart.component.scss']
})
export class ShowChartComponent implements OnInit,AfterViewInit {
  chartdata: any[]=[];
  totalCount: number = 0;
  id:any;
  dataChart:any;

  @ViewChild('pieChart') pieChart!:  | ElementRef;

  constructor(private dashboardService:DashboardService,@Inject(MAT_DIALOG_DATA) public data: any) {
    if(data){
      this.dataChart = data
    }
  }
  ngAfterViewInit(): void {
   if(this.dataChart){
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawPieChart);
   }
  }

  ngOnInit(): void {

    google.charts.load('current', { 'packages': ['corechart'] });

    google.charts.setOnLoadCallback(() => {
      this.fetchData();
      this.drawChart();
    });
    google.charts.setOnLoadCallback(this.drawChart.bind(this)); // Bind the function to the correct context
  }

  fetchData(){
    this.dashboardService.getSaleData(this.id).subscribe({
      next:(res:any)=>{
        // console.log(res)
        this.chartdata = res;
        this.drawChart()
      },
      error: (err: any) => {
        console.error('Error fetching data from API:', err);
      }
    })


  }



  drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task');
    data.addColumn('number', 'Count');
    var dataArray = [];
    for (const key in this.chartdata) {
      if (this.chartdata.hasOwnProperty(key)) {
        dataArray.push([key, this.chartdata[key]]);
        this.totalCount += this.chartdata[key];
      }
    }

    data.addRows(dataArray);

    var options = {
      title: 'Sales Person',
      titleTextStyle: {
        fontSize: 20,
        bold: true,
      },
      is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);

    var totalCount = this.calculateTotalCount(this.chartdata);
    // console.log('Total Count:', totalCount);
    this.totalCount = this.calculateTotalCount(this.chartdata);

  }
  calculateTotalCount(dataArray: any[]): number {
    let totalCount = 0;
    for (const item of dataArray) {
      totalCount += item[1];
    }
    return totalCount;
  }

  drawPieChart = () => {
    const data = google.visualization.arrayToDataTable([
      ['Proposal Type','Proposal Count'],
      ['Approve Proposal',this.dataChart.ApproveProposals],
      ['Inprogress Proposal',this.dataChart.InProgressProposals]
    ]
    );

    const options: any = {
      title: 'Sales Chart',
      titleTextStyle: {
        color: 'white', // Change the color of the title here
        fontSize: 25, // Optional: Adjust the font size of the title
        bold: true, // Optional: Set the title to bold
      },

      backgroundColor: '#c3343a',
      colors: ['#b0022d', '#ed8882','#562424','#460012','#69011b','#dfab99'], // Set the slice colors here
      legend: {
        position: 'top',
        textStyle: {
          color: 'white', // Change the color of the legends here
          fontSize: 18, // Change the font size of the legends here
        },
      },
      is3D: true,

    };

    // console.log(this.pieChart)
  if(this.pieChart){

    const chart = new google.visualization.PieChart(
      this.pieChart.nativeElement
    );
    chart.draw(data, options);
  }

  };
}
