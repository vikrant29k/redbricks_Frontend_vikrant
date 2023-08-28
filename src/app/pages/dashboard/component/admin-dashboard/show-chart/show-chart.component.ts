import { Component, OnInit } from '@angular/core';
import { DashboardService } from './../../../../../service/dashboard/dashboard.service';
declare var google: any;

@Component({
  selector: 'app-show-chart',
  templateUrl: './show-chart.component.html',
  styleUrls: ['./show-chart.component.scss']
})
export class ShowChartComponent implements OnInit {
  chartdata: any[]=[];
  totalCount: number = 0;
  id:any;

  constructor(private dashboardService:DashboardService) { }

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
        console.log(res)
        this.chartdata = res;
        this.drawChart()
      },
      error: (err: any) => {
        console.error('Error fetching data from API:', err);
      }
    })


  }



  drawChart() {
    console.log(this.chartdata);

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
    console.log('Total Count:', totalCount);
    this.totalCount = this.calculateTotalCount(this.chartdata);

  }
  calculateTotalCount(dataArray: any[]): number {
    let totalCount = 0;
    for (const item of dataArray) {
      totalCount += item[1];
    }
    return totalCount;
  }
}
