import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import { pipe, map, count, take } from 'rxjs';
import { Router } from '@angular/router';
import { JWTService } from 'src/app/service/jwt/jwt.service';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fadeOut, blub } from 'src/assets/animation/template.animation';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { ShowChartComponent } from './show-chart/show-chart.component';
import { MatDialog } from '@angular/material/dialog';
import { SalesHeadApprovalComponent } from './sales-head-approval/sales-head-approval.component';
import { TooltipComponent } from '@angular/material/tooltip';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
@Component({
  selector: 'dashboard-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeOut, blub,
  trigger('cardAnimation', [
    state('hidden', style({ opacity: 0,display:'none', transform: 'translateX(-50px)' })),
    state('visible', style({ opacity: 1,display:'block', transform: 'translateX(0)' })),
    transition('hidden => visible', animate('300ms ease-in')),
    transition('visible => hidden', animate('300ms ease-out')),
  ]),
  trigger('menuAnimation', [
    state('hidden', style({
      right: '-50px',
      opacity: 0,
    })),
    state('visible', style({
      right: '50px',
      opacity: 1,
    })),
    transition('hidden => visible', animate('300ms ease-in')),
    transition('visible => hidden', animate('300ms ease-out'))
  ])
]
})
export class DashboardAdminDashboard implements OnInit {
  showCard = false
  selectedCenter: string | null = null;
  locations:any[]=["Pune",'Hyderabad'];
  open : boolean = false;
  buttonLogo: string = "+";
  isToggle: boolean = true;
  menuOpen: boolean = false;
// hideBackButton: boolean = false;


  constructor(
    private proposalService: ProposalService,
    private dashboardService: DashboardService,
    private userservice: UserService,
    private route: Router,
    private jwt: JWTService,
    private cd: ChangeDetectorRef,
    private dialog:MatDialog
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatTable) table!: MatTable;
  shownotification: boolean = false;
  menuOpen1: boolean = true;
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
  menuItems = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Contact', link: '/contact' },
  ];
  menuState = 'hidden';
state='hidden';
  toggleMenu() {
    this.menuState = this.menuState === 'hidden' ? 'visible' : 'hidden';
  }
  toggleMenus() {
    this.state = this.state === 'hidden' ? 'visible' : 'hidden';
  }

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
  isShowTooltip:boolean = false
  isshowUserList:boolean =false;
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
    this.dashboardService.getCoflicts().subscribe(
      (res) => {
        // Handle the successful response
        this.dataSourceConflict = res;
        this.notifications = this.dataSourceConflict.length;
        // console.log(res);
      },
      (error) => {
        // Handle the error here
        // console.error('An error occurred:', error);

      }
    );

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

  }
today:any;
yesterDay:any;
dayBeforeYesterday:any;
  ngOnInit(): void {
    // this.getUserListArray()

    //  this.resolveConflict('RBOHYSA26121133')
    if (this.title === 'sales head') {
      // console.log(this.title);
      this.getConflict();
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
    // this.totalUserNo();
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
      // console.log('loaction', res);
    });
    this.dashboardService.getRecentProposal().subscribe((res:any) => {
      // console.log(res)
      this.tableDataSource(res);
      this.countOfRecentProposal=res.length
      // console.log("COUNTT",this.countOfRecentProposal)
      this.Amount = res;

    });

  }
countOfRecentProposal!:number
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
  if (this.title === 'sales head'){
    this.dialog.open(SalesHeadApprovalComponent,{
      width: '1200px',
      height:'615px',
      panelClass:'salesHead',
      data:{id:id}

  })

    this.dialog.afterAllClosed.subscribe(()=>{
      this.deleteRow(id)
    })
  }

}
userList: any[]=[];
getUserListArray = ()=>{
  this.dashboardService.getUserListArray().pipe(take(1)).subscribe((res:any)=>{
    // console.log(res)
    this.userList =res
  })
}
openChartDialog(enterAnimationDuration: string, exitAnimationDuration: string,id:any){
  this.dashboardService.getSelsProposalCount(id).subscribe((res:any)=>{
  this.dialog.open(ShowChartComponent,{
     hasBackdrop:false,
      enterAnimationDuration,
      exitAnimationDuration,
      data:res
  })
  })
}}
