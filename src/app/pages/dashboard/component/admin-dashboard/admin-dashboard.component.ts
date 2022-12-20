import { Component, OnInit, ViewChild } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import { pipe, map, count } from 'rxjs';
import { JWTService } from 'src/app/service/jwt/jwt.service';
import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';
import { fadeOut, blub } from 'src/assets/animation/template.animation';
import { LocationService } from 'src/app/service/location/location.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
// export interface cityArray {
//   name:string;
//   selectedSeat:number;
//   totalSeats:number;
//   centers:[centerName:string,
//     seatSelected: number,
//     totalSeat: number ];
// }
// export interface user {
//   _id: string;
//   salesPerson: string;
//   status: string;
// }
// const saleslist: user[] = 
// [
//   { _id: 'RBHYD2211124', salesPerson: 'Atul', status: 'Pending' },
//   { _id: 'RBHYD2211643', salesPerson: 'Rahul', status: 'Pending' },
//   { _id: 'RBHYD2211463', salesPerson: 'Manpreet', status: 'Pending' },
//   { _id: 'RBHYD2211457', salesPerson: 'Varun', status: 'Pending' },
// ];
@Component({
  selector: 'dashboard-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeOut, blub],
})
export class DashboardAdminDashboard implements OnInit {
  constructor(
    private proposalService: ProposalService,
    private dashboardService: DashboardService,
    private userservice: UserService,
    private jwt: JWTService,
    private location: LocationService
  ) {}

  title: any = this.jwt.getUserRole();
  cityName: any;
  totalUser: any;
  saleslist:any;
  dataSource:any;
  clk: boolean = false;
  changeColor: boolean = false;
  displayedColumns: string[]=[];
  users:any;
  status: boolean = false;
 city:any;
//  city_center:any;
  clickEvent() {
    this.status = !this.status;
  }
  ngOnInit(): void {
    if(this.title==='sales head'){
      // console.log(this.title);
      this.displayedColumns= ['salesPerson', '_id', 'view', 'approve', 'delete'];

    }else {
      this.displayedColumns= ['salesPerson', '_id', 'view','delete' ];
      // console.log(this.title,"admin")
    }
    this.totalUserNo();
    this.getDashoboardData();
  }
  // total number of users 
totalUserNo(){
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
  // dashboard data get function
  getDashoboardData() {
    this.dashboardService.getUserData().subscribe((res) => {
      this.users=res;
      this.users.sort((a:any, b:any) => b.totalProposalCount - a.totalProposalCount);
      // console.log('user:', res);
      
    });
    this.dashboardService.getLocationData().subscribe((res) => {
      this.city= res;
      // this.city_center=res;
      // console.log("centers",[...this.city_center.centers])
      // console.log('loaction', res);
    });
    this.dashboardService.getRecentProposal().subscribe((res) => {
      this.dataSource=res;
      console.log('recent:', this.dataSource);
    });
  }
  
  // delete the row
  deleteRow(id: string) {
    this.dataSource = this.dataSource.filter((u:any) => u._id !== id);
  }

  // function for changing status of proposal from pending to approve
  changeStatus(_id: string) {
    this.changeColor = !this.changeColor;
    this.clk = !this.clk;
    // console.log(saleslist);
    if (this.clk) {
      const list = this.dataSource.map((res:any) => {
        if (_id == res._id) {
          res.status = 'Approve';
          console.log(res);
        }
      });
      this.clk = !this.clk;
    }
  }
}
  // selectedButton: any[] = [];
  // approve: boolean = false;
  
  // delete: boolean = false;


  // city: any[] = [
  //   {
  //     name: 'Hyderabad',
  //     select: 90,
  //     total: 120,
  //     centers: [
  //       {
  //         center_name: 'Salarpuria',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'WTC',
  //         seatSelected: 60,
  //         totalSeat: 70,
  //         Center_Proposal: 30,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Pune',
  //     select: 60,
  //     total: 100,
  //     centers: [
  //       {
  //         center_name: 'BSB',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'Pavilion',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Mumbai',
  //     select: 60,
  //     total: 100,
  //     centers: [
  //       {
  //         center_name: 'PSP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'ATP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Delhi',
  //     select: 60,
  //     total: 100,
  //     centers: [
  //       {
  //         center_name: 'NTR',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'PBP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Chennai',
  //     select: 90,
  //     total: 150,
  //     centers: [
  //       {
  //         center_name: 'NTR',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'PBP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'TLP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'BSB',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'Pavilion',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Bangalore',
  //     select: 60,
  //     total: 100,
  //     centers: [
  //       {
  //         center_name: 'NTR',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //       {
  //         center_name: 'PBP',
  //         seatSelected: 30,
  //         totalSeat: 50,
  //         Center_Proposal: 60,
  //       },
  //     ],
  //   },
  // ];

  // firsttime: any = 'true';

  // users: any[] = [
  //   { firstName: 'Rahul',
  //     lastName: 'Kashyap',
  //     totalProposal: 180,
  //     role: 'sales',
  //   },
  //   {
  //     firstName: 'Atul',
  //     lastName: 'Shinde',
  //     totalProposal: 190,
  //     role: 'admin',
  //   },
  //   { firstName: 'Manpreet', lastName: 'T', totalProposal: 150, role: 'admin' },
  //   { firstName: 'Varun', lastName: 'M', totalProposal: 160, role: 'sales' },
  //   { firstName: 'Aditya', lastName: 'G', totalProposal: 170, role: 'sales' },
  //   // { firstName: 'B',lastName:'G', totalProposal: 190, role:"sales" },
  //   { firstName: 'Tanmay', lastName: 'D', totalProposal: 150, role: 'admin' },
  //   { firstName: 'Y', lastName: 'Y', totalProposal: 140, role: 'admin' },
  // ].sort((a, b) => b.totalProposal - a.totalProposal);
  // ipc_Users: any[] = [
  //   { userName: 'C & W', totalProposal: 180 },
  //   { userName: 'KF', totalProposal: 190 },
  //   { userName: 'Colliers', totalProposal: 150 },
  //   { userName: 'Savills', totalProposal: 160 },
  //   { userName: 'CBRE', totalProposal: 170 },
  //   { userName: 'JLL', totalProposal: 140 },
  // ];
  // nonIpc_Users: any[] = [
  //   { userName: 'CityInfo', totalProposal: 180 },
  //   { userName: 'EHRPCL', totalProposal: 190 },
  // ];

  // topUsers: any;


  // array: any[] = [];
  // getLocationData() {
  //   this.location.getAllLocation().subscribe((res: any) => {
  //     //  this.array.push(res);
  //     const result = res.map((a: any) => {
  //       return {
  //         cityName: a.location,
  //         selectedSeat: a.availableNoOfWorkstation,
  //         totalSeat: a.totalNoOfWorkstation,
  //         center: a.center,
  //       };
  //     });
  //     console.log(result);
  //     this.cityName = result;
  //   });
  // }
  // CityNames: any;
  // getCityNames() {
  //   this.location.getLocationList().subscribe((res: any) => {
  //     //  this.array.push(res);
  //     const rest = res.map((a: any) => {
  //       return a;
  //     });

  //     console.log(rest);
  //   });
  // }

  //  get dashboard service
 

