import { Component, OnInit, ViewChild } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import { pipe, map, count } from 'rxjs';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { JWTService } from 'src/app/service/jwt/jwt.service';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fadeOut, blub } from 'src/assets/animation/template.animation';
import { LocationService } from 'src/app/service/location/location.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { ShowChartComponent } from './show-chart/show-chart.component';
import { MatDialog } from '@angular/material/dialog';
import { SalesHeadApprovalComponent } from './sales-head-approval/sales-head-approval.component';
@Component({
  selector: 'dashboard-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeOut, blub,
    trigger('slideInOut', [
    state('in', style({ transform:'translateX(0)',width:'80vw',height:'34rem'})),
    state('out', style({ transform: 'translateX(50%)',width:'0',height:'0' })),
    transition('in => out', animate('2s ease-in-out')),
    transition('out => in', animate('2s ease-in-out')),
  ]),
  trigger('cardAnimation', [
    state('hidden', style({ opacity: 0,display:'none', transform: 'translateX(-50px)' })),
    state('visible', style({ opacity: 1,display:'block', transform: 'translateX(0)' })),
    transition('hidden => visible', animate('300ms ease-in')),
    transition('visible => hidden', animate('300ms ease-out')),
  ])]
})
export class DashboardAdminDashboard implements OnInit {
  showCard = false
  selectedCenter: string | null = null;
  locations:any[]=["Pune",'Hyderabad'];
  constructor(
    private proposalService: ProposalService,
    private dashboardService: DashboardService,
    private userservice: UserService,
    private route: Router,
    private jwt: JWTService,
    private cd: ChangeDetectorRef,
    private location: LocationService,
    private dialog:MatDialog
  ) {}
  onLocationSelected = (location: any) => {

}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatTable) table!: MatTable;
  shownotification: boolean = false;
  menuOpen: boolean = false;
  hideBackButton: boolean = false;
  title: any = this.jwt.getUserRole();
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
  isHidden: boolean = false;
  //  =[
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'},
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'},
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'},
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'},
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'},
  //   {_id:"RAHAY124551",salesPerson:"Rahul K",clientName:'CBRE'}
  // ];
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
  //  city_center:any;
  clickEvent() {
    this.status = !this.status;
  }
  toggleLocation(location: any): void {
    this.selectedCenter = location;
    location.showLocation = !location.showLocation;
    location.isHovered=!location.isHovered
  }
  // get conflicts
  getConflict() {
    this.dashboardService.getCoflicts().subscribe((res) => {
      this.dataSourceConflict = res;
      this.notifications = this.dataSourceConflict.length
      // console.log(res);
    });
  }
  resolveConflict(_id: string) {
    Swal.fire({
      title: 'Resolve Conflict',
      text: 'Are you sure you want to resolve this conflict?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Resolve',
      confirmButtonColor: '#C3343A',
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.proposalService.resolveConflict(_id).subscribe({
          next: () => {
            // console.log('Resolved');
          },
          error: (err: any) => {
            // console.log(err);
          },
        });
      }
    });
    // this.proposalService.resolveConflict(_id).subscribe(res=>{

    //   console.log("RC",res);

    // })
  }
today:any;
yesterDay:any;
dayBeforeYesterday:any;
  ngOnInit(): void {
    this.dashboardService.getRecentProposal().subscribe((res) => {
      console.log('recent', res);
    });
    this.getConflict();
    //  this.resolveConflict('RBOHYSA26121133')
    if (this.title === 'sales head') {
      // console.log(this.title);
      this.shownotification = true;
      this.displayedColumnsRecent = [
        'salesPerson',
        '_id',
        'view',
        // 'approve',
        'delete',
      ];
      this.displayedColumnsConflict = ['_id', 'salesPerson', 'resolve'];
    } else {
      this.shownotification = false;
      this.displayedColumnsRecent = ['salesPerson', '_id', 'view', 'lock'];
      // console.log(this.title,"admin")
    }
    this.totalUserNo();
    this.getDashoboardData();
  }
  // total number of users
  totalUserNo() {
    var a;
    this.userservice
      .getAllUser()
      .pipe(
        map((res: any) => {
          a = res.length;
          this.totalUser = a;
          // console.log(this.totalUser);
        })
      )
      .subscribe();
  }
  tableDataSource(data: any) {
    this.dataSourceRecent =data;
    this.dataSourceRecent.paginator = this.paginator;
    this.cd.detectChanges();
    // this.table.renderRows();
  }
  // dashboard data get function
  getDashoboardData() {
    this.dashboardService.getUserData().subscribe((res) => {
      this.users = res;
      this.users.sort(
        (a: any, b: any) => b.totalProposalCount - a.totalProposalCount
      );
      var a = this.users.slice(0, 4);
      this.users = [...a];
      //  console.log("ahff",a)
      // this.users.slice(0,4);
      // console.log('user:', res);
    });
    this.dashboardService.getLocationData().subscribe((res) => {
      this.city = res;
      // this.city_center=res;
      // console.log("centers",[...this.city_center.centers])
      console.log('loaction', res);
    });
    this.dashboardService.getRecentProposal().subscribe((res:any) => {
      // console.log(res)
      this.tableDataSource(res);
      this.countOfRecentProposal=res.length
      console.log("COUNTT",this.countOfRecentProposal)
      this.Amount = res;

    });

  }
countOfRecentProposal!:number
  // Approve proposal
  // approvePropsal(id: string) {
  //   this.System_value = this.Amount.find((x:any) => x._id === id).previousFinalOfferAmmount ;
  //   this.client_value =  this.Amount.find((x:any) => x._id === id).clientFinalOfferAmmount ;
  //   // console.log(this.System_value, 'System_value');
  //   // console.log(this.client_value, 'client_value');

  //   var a = 'myprice';
  //   Swal.fire({
  //     title: 'Approve Proposal',
  //     html: `Client Price = ${(this.client_value).toFixed(2)} <br> System Price = ${(this.System_value).toFixed(2)}`,
  //     icon: 'info',
  //     showConfirmButton: true,
  //     confirmButtonText: 'Confirm',
  //     confirmButtonColor: '#C3343A',
  //     input: 'number',
  //     inputAttributes:{
  //       required:'true'
  //     } ,
  //     inputLabel: 'Enter Final Amount',
  //     showCancelButton: true,
  //     cancelButtonColor: '#7D7E80',
  //   }).then((confirmation) => {
  //     if (confirmation.isConfirmed) {
  //       // this.proposalService.approveProposal(id, { finalOfferAmmount: confirmation.value, salesHeadFinalOfferAmmount: confirmation.value })
  //       //   .subscribe((res) => {
  //       //     // console.log(res,"Final offer amount sales head dashboard approve")
  //       //    this.deleteRow(id)
  //       //   });
  //     }
  //   });
  // }

  //lock proposal
  lockProposal(id: string) {
    this.selectedSeatOfCurrentProposal =  this.Amount.find((x:any) => x._id === id).totalNumberOfSeats ;
    var a = 'myprice';
    Swal.fire({
      title: 'Lock Seats Of This Proposal',
      html: `Selected Seat Of This Proposal Are ${(this.selectedSeatOfCurrentProposal)} Click On Confirm To Lock The Seats`,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#C3343A',
      inputAttributes:{
        required:'true'
      } ,
      showCancelButton: true,
      cancelButtonColor: '#7D7E80',
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        // this.proposalService.lockProposal(id, { lockProposal:true })
        //   .subscribe((res:any) => {
        //     console.log(res,"Locked Proposal")

                 this.route.navigate(['/admin','location','lock-layout',id])

          // });
          this.deleteRow(id)
      }
    });
  }

  // delete the row
  deleteConflict(id: any) {
    // console.log(this.dataSourceRecent.value[id]);

    this.dataSourceConflict = this.dataSourceConflict.filter((u:any) => u._id !== id);
    this.notifications = this.dataSourceConflict.length
    // console.log(this.dataSourceConflict)
  }
  deleteRow(id: any) {
    // console.log(this.dataSourceRecent.value[id]);

    this.dataSourceRecent = this.dataSourceRecent.filter((u:any) => u._id !== id);
    // console.log(this.dataSourceRecent)
  }
  // view proposals
  viewDetails = (Id: string) => {
    let currentRoute = this.route.url.split('/')[1];
    if (currentRoute === 'sales') {
      this.route.navigate(['/sales', 'new-proposal', 'proposal-preview', Id]);
    } else {
      this.route.navigate(['/admin', 'new-proposal', 'proposal-preview', Id]);
    }
  };
  // function for changing status of proposal from pending to approve
  changeStatus(_id: string) {
    this.changeColor = !this.changeColor;
    this.clk = !this.clk;
    // console.log(saleslist);
    if (this.clk) {
      const list = this.dataSourceRecent.map((res: any) => {
        if (_id == res._id) {
          res.status = 'Approve';
          // console.log(res);
        }
      });
      this.clk = !this.clk;
    }
  }
  public line_ChartData = [
    ['Year', 'Sales', 'Expenses'],
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 1030, 540]];
    public line_ChartOptions = {
      title: 'Company Performance',
      curveType: 'function',
      legend: {
          position: 'bottom'
      }
  };



  openDialog(){
    this.dialog.open(ShowChartComponent, {
      width: '900px',
      height:' 615px',
    });
  }

salesHead(id:any){
  this.dialog.open(SalesHeadApprovalComponent,{
    width: '1000px',
    height:'615px',
    panelClass:'salesHead',
    data:{id:id}

  })
}

}
