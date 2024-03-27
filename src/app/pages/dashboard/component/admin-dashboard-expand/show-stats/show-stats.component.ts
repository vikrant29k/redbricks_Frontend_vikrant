import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { CostService } from 'src/app/service/cost/cost.service';
declare var google: any;
export interface DialogData {
  center: any;
}
@Component({
  selector: 'app-show-stats',
  templateUrl: './show-stats.component.html',
  styleUrls: ['./show-stats.component.scss'],
})
export class ShowStatsComponent implements OnInit, AfterViewInit {
  totalValue: any;
  rentAndCamTotal: any;
  bookingPriceUptilNow: any;
  rent: any;
  cam: any;
  currentValue: any;
  rackValue: any;
  centerName: any;
  totalNumber: any;
  totalCost: any;
  selectedNumber: any;
  currentCostOfSelectedSeats: any;
  standarCost: any;
  profitLoss: any;
  currentSeatPrice: any;
  chartTitle: any;
  futureRackRate:any;
  @ViewChild('pieChart') pieChart: any | ElementRef;

  constructor(
    private proposalService: ProposalService,
    private costService: CostService,
    public dialogRef: MatDialogRef<ShowStatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}


  ngOnInit(): void {
    // console.log(this.data.center, 'on open');
    let data = this.data.center;
    this.centerName = data.name;
    this.bookingPriceUptilNow = new Intl.NumberFormat('en-IN', {currency: 'INR',}).format(data.bookingPriceUptilNow);
    let bookedPrice = data.bookingPriceUptilNow;
    this.totalNumber = data.totalNoOfWorkstation;
    this.selectedNumber = data.selectedNoOfSeats;
    this.rentAndCamTotal = data.rentAndCamTotal;
    this.futureRackRate = data.futureRackRate;
    this.currentSeatPrice=data.currentRackRate;
    this.currentValue = data.systemPrice;
    this.rackValue = data.rackRate

    //deleted the the cost updated
  }

// draws pie chart
  drawChart = () => {
    const data = google.visualization.arrayToDataTable([
      ['Sold', 'SoldCount'],
      ['Remaining', this.totalNumber - this.selectedNumber],
      ['Sold', this.selectedNumber],
    ]);

    const options: any = {
      title: this.chartTitle,
      titleTextStyle: {
        color: 'white', // Change the color of the title here
        fontSize: 25, // Optional: Adjust the font size of the title
        bold: true, // Optional: Set the title to bold
      },

      backgroundColor: '#c3343a',
      colors: ['#b0022d', '#ed8882'], // Set the slice colors here
      legend: {
        position: 'top',
        textStyle: {
          color: 'white', // Change the color of the legends here
          fontSize: 18, // Change the font size of the legends here
        },
      },
      is3D: true,
    };

    const chart = new google.visualization.PieChart(
      this.pieChart.nativeElement
    );

    chart.draw(data, options);
  };


  ngAfterViewInit() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
    // google.charts.load('current', { packages: ['corechart'] });
  }
}
