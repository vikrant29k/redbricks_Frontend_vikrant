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
 
  users: any[] = [
    { userName: 'Rahul K', totalProposal: 180 },
    { userName: 'Atul S', totalProposal: 90 },
    { userName: 'Manpreet T', totalProposal: 150 },
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
  }
  getMax() {
 this.topUsers = this.users.sort((a, b) => b.totalProposal - a.totalProposal);

  }
}
