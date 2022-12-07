import { Component, OnInit, ViewChild } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import { pipe, map, count } from 'rxjs';

@Component({
  selector: 'dashboard-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class DashboardAdminDashboard implements OnInit {
  totalUser: any;
  constructor(
    private proposalService: ProposalService,
    private userservice: UserService
  ) {}
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }
  total_Proposal = 40;
  city: any[] = [
    {
      name: 'Hyderabad',
      select: 90,
      total: 120,
      centers: [
        {
          center_name: 'Salarpuria',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'WTC',
          seatSelected: 60,
          totalSeat: 70,
          Center_Proposal: 30,
        },
      ],
    },
    {
      name: 'Pune',
      select: 60,
      total: 100,
      centers: [
        {
          center_name: 'BSB',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'Pavilion',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
      ],
    },
    {
      name: 'Mumbai',
      select: 60,
      total: 100,
      centers: [
        {
          center_name: 'PSP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'ATP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
      ],
    },
    {
      name: 'Delhi',
      select: 60,
      total: 100,
      centers: [
        {
          center_name: 'NTR',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'PBP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
      ],
    },
    {
      name: 'Chennai',
      select: 90,
      total: 150,
      centers: [
        {
          center_name: 'NTR',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'PBP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'TLP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'BSB',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'Pavilion',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        }
      ],
    },
    {
      name: 'Bangalore',
      select: 60,
      total: 100,
      centers: [
        {
          center_name: 'NTR',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
        {
          center_name: 'PBP',
          seatSelected: 30,
          totalSeat: 50,
          Center_Proposal: 60,
        },
      ],
    },
  ];
  firsttime:any="true";
  users: any[] = [
    { userName: 'Rahul K', totalProposal: 180, role:"sales" },
    { userName: 'Atul S', totalProposal: 190, role:"admin" },
    { userName: 'Manpreet T', totalProposal: 150, role:"admin" },
    { userName:'Varun', totalProposal:160, role:"sales" },
    { userName: 'A K', totalProposal: 180, role:"sales" },
    { userName: 'B S', totalProposal: 190, role:"sales" },
    { userName: 'T G', totalProposal: 150, role:"admin" },
    { userName:'Y N', totalProposal:160, role:"admin" },
  ].sort((a, b) => b.totalProposal - a.totalProposal);
  ipc_Users: any[] = [
    { userName: 'C & W', totalProposal: 180 },
    { userName: 'KF', totalProposal: 190 },
    { userName: 'Colliers', totalProposal: 150 },
    { userName:'Savills', totalProposal:160 },
    { userName: 'CBRE', totalProposal: 170 },
    { userName:'JLL', totalProposal:140 },
  ];
  nonIpc_Users: any[] = [
    { userName: 'CityInfo', totalProposal: 180 },
    { userName: 'EHRPCL', totalProposal: 190 },
  ];

  topUsers:any;

  ngOnInit(): void {
    var a;
    this.userservice
      .getAllUser()
      .pipe(
        map((res: any) => {
          a = res.length;
          this.totalUser = a;
        })
      )
      .subscribe();
    this.getMax();
    this.firsttime = localStorage.getItem("firsttime");

    if (
      localStorage.getItem("firsttime") == null ||
      localStorage.getItem("firsttime") == undefined
    ) {
      this.firsttime = 'true';
      localStorage.setItem("firsttime", "true");
    } else localStorage.setItem("firsttime", "false");
  }
  
  getMax() {
//  this.topUsers = this.users.sort((a, b) => b.totalProposal - a.totalProposal);

  }
}
