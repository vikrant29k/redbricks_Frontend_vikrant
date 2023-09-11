import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BrokerService } from 'src/app/service/broker/broker.service';
import { JWTService } from 'src/app/service/jwt/jwt.service';

@Component({
  selector: 'app-broker-details',
  templateUrl: './broker-details.component.html',
  styleUrls: ['./broker-details.component.scss']
})
export class BrokerDetailsComponent implements OnInit , AfterViewInit{
  brokerId: any;
  brokerDetails: any;
  totalPreposalAsPerLocation: any =[];
  monthlyPropCount: any;
  salesPersonDetails: any;
  totalNumber: any;
  selectedNumber: any;
  chartTitle: any;
  pichartArray: any;
  constructor(
    private cd: ChangeDetectorRef,
    private activetRaouter:ActivatedRoute,
    private brokerService:BrokerService
  ) {}
  ngAfterViewInit(): void {
    this.getPtoposalCountAsPerLocation(this.brokerId)
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('pieChart') pieChart: any | ElementRef;

  // @ViewChild(MatTable) table!: MatTable;
  shownotification: boolean = false;
  menuOpen: boolean = false;
  hideBackButton: boolean = false;
  // title: any = this.jwt.getUserRole();
  cityName: any;
  totalUser: any;
  saleslist: any;
  dataSourceRecent: any;
  FinalAmount: any;
  Amount: any;
   System_value:any;
   client_value:any;
   selectedSeatOfCurrentProposal:any;
  UpdateAmount: any;
  dataSourceConflict: any;
  notifications: any;
  deselect:any;
  //  = this.dataSourceConflict.length
  clk: boolean = false;
  changeColor: boolean = false;
  displayedColumnsRecent: string[] = [];
  displayedColumnsConflict: string[] = [];
  users: any;
  status: boolean = false;
  city: any;

  ngOnInit(): void {
    this.brokerId = this.activetRaouter.snapshot.params["bId"];
    if (this.brokerId){
      this.getPtoposalCountAsPerLocation(this.brokerId)
      this.getTotalProposalCountOfBroker(this.brokerId)
      this.getTotalBrokerProposal(this.brokerId);
      
      this.getPreposalDetails(this.brokerId)
    } 
    this.displayedColumnsConflict = [ 'salesPerson','_id', 'resolve','count'];

   
  }

  tableDataSource(data: any) {
    this.dataSourceRecent =data;
    this.dataSourceRecent.paginator = this.paginator;
    this.cd.detectChanges();
    // this.table.renderRows();
  }
  // dashboard data get function



// NEwImportent Data Code

getTotalProposalCountOfBroker = (id:string) =>{
  this.brokerService.getProposalCount(id).subscribe((res:any)=>{
  console.log(res)
  this.brokerDetails = res
  });
}

getTotalBrokerProposal = (id:string) =>{
  const data = {
    targetMonth: new Date().getMonth()+1,
    targetYear:new Date().getFullYear()
  }
  this.brokerService.getBrokerProposalAvg(id,data).subscribe((res:any)=>{
    this.monthlyPropCount = res
    console.log(res)
  });
}

getPtoposalCountAsPerLocation = (id:string) =>{
    this.brokerService.getProposalCountAsPerLocation(id).subscribe((res:any)=>{
      console.log(res);
      this.totalPreposalAsPerLocation = res
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
    
    });
}

getPreposalDetails = (id:string) =>{
    this.brokerService.getProposalSelsePerson(id).subscribe((res:any)=>{
      // console.log(res)
      this.salesPersonDetails = res;
    })
}
drawChart = () => {
  const data = google.visualization.arrayToDataTable([
    ['Location','Proposal Count'],
    ...this.totalPreposalAsPerLocation
  ]
  );

  const options: any = {
    title: this.chartTitle,
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

  const chart = new google.visualization.PieChart(
    this.pieChart.nativeElement
  );

  chart.draw(data, options);
};

}
