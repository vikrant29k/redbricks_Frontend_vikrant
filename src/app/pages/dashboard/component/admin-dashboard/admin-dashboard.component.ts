import { Component, OnInit, ViewChild } from '@angular/core';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import { pipe, map, count } from 'rxjs';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { JWTService } from 'src/app/service/jwt/jwt.service';
import Swal from 'sweetalert2';
import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fadeOut, blub } from 'src/assets/animation/template.animation';
import { LocationService } from 'src/app/service/location/location.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthGuardService } from 'src/app/service/auth-guard/auth-guard.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    private route: Router,
    private jwt: JWTService,
    private cd: ChangeDetectorRef,
    private location: LocationService
  ) {}

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
  UpdateAmount: any;
  dataSourceConflict: any;
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
  // get conflicts
  getConflict() {
    this.dashboardService.getCoflicts().subscribe((res) => {
      this.dataSourceConflict = res;
      this.notifications = this.dataSourceConflict.length
      console.log(res);
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
            console.log('Resolved');
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
    // this.proposalService.resolveConflict(_id).subscribe(res=>{

    //   console.log("RC",res);

    // })
  }

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
        'approve',
        'delete',
      ];
      this.displayedColumnsConflict = ['_id', 'salesPerson', 'resolve'];
    } else {
      this.shownotification = false;
      this.displayedColumnsRecent = ['salesPerson', '_id', 'view'];
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
      // console.log('loaction', res);
    });
    this.dashboardService.getRecentProposal().subscribe((res) => {
      console.log(res)
      this.tableDataSource(res);
      this.Amount = res;

    });

  }

  // Approve proposal
  approvePropsal(id: string) {
    this.System_value = this.Amount.find((x:any) => x._id === id).previousFinalOfferAmmount ;
    this.client_value =  this.Amount.find((x:any) => x._id === id).clientFinalOfferAmmount ;
    console.log(this.System_value, 'System_value');
    console.log(this.client_value, 'client_value');

    var a = 'myprice';
    Swal.fire({
      title: 'Approve Proposal',
      html: `Client Price = ${(this.client_value).toFixed(2)} <br> System Price = ${(this.System_value).toFixed(2)}`,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#C3343A',
      input: 'number',
      inputAttributes:{
        required:'true'
      } ,
      inputLabel: 'Enter Final Amount',
      showCancelButton: true,
      cancelButtonColor: '#7D7E80',
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.proposalService.approveProposal(id, { finalOfferAmmount: confirmation.value, salesHeadFinalOfferAmmount: confirmation.value })
          .subscribe((res) => {
            console.log(res,"Final offer amount sales head dashboard approve")
          });
      }
    });
  }
  // delete the row
  deleteConflict(id: any) {
    // console.log(this.dataSourceRecent.value[id]);

    this.dataSourceConflict = this.dataSourceConflict.filter((u:any) => u._id !== id);
    this.notifications = this.dataSourceConflict.length
    console.log(this.dataSourceConflict)
  }
  deleteRow(id: any) {
    // console.log(this.dataSourceRecent.value[id]);

    this.dataSourceRecent = this.dataSourceRecent.filter((u:any) => u._id !== id);
    console.log(this.dataSourceRecent)
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
          console.log(res);
        }
      });
      this.clk = !this.clk;
    }
  }
}
