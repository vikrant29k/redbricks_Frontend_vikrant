import { Component,OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { Router } from "@angular/router";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Dialog } from "@angular/cdk/dialog";
import { ReportService } from "src/app/service/report/report.service";
// import { ReportDialogComponent } from "../report-dialog/report-dialog.component";
import { JWTService } from "src/app/service/jwt/jwt.service";
import Swal from "sweetalert2";
@Component({
    selector: 'admin-layout-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class AdminLayoutSidebarComponent implements OnInit {
  user:any;
  ngOnInit(): void {
      // console.log("Hello user",this.jwt.getUserRole());
    this.user=this.jwt.getUserRole()
  }
    @Output() drawerClicked = new EventEmitter
    // menuOpen: boolean = false;

    logExpanded: boolean = false;
    userExpanded: boolean = false;
    locationExpanded: boolean = false;
    brokerExpand: boolean = false;
    clientExpand:boolean=false;
    calculation:boolean = false;
    expandAccording = (title?: string) => {
        switch (title) {
            case 'log':
                this.logExpanded = !this.logExpanded;
                this.userExpanded = false;
                this.clientExpand=false;
                this.locationExpanded = false;
                this.brokerExpand = false;
                this.calculation = false;
                break;

            case 'user':
                this.userExpanded = !this.userExpanded;
                this.logExpanded = false;
                this.clientExpand=false;
                this.locationExpanded = false;
                this.calculation = false;
                this.brokerExpand = false;
                break;

            case 'location':
                this.locationExpanded = !this.locationExpanded;
                this.logExpanded = false;
                this.clientExpand=false;
                this.userExpanded = false;
                this.brokerExpand = false;
                this.calculation = false;
                break;

            case 'broker':
                this.brokerExpand = !this.brokerExpand;
                this.locationExpanded = false;
                this.calculation = false;
                this.logExpanded = false;
                this.clientExpand=false;
                this.userExpanded = false;
                break;

            case 'calculation':
                  this.calculation = !this.calculation;
                  this.locationExpanded = false;
                  this.brokerExpand = false;
                  this.logExpanded = false;
                  this.clientExpand=false;
                  this.userExpanded = false;
                  break;
            
            case 'client':
                    this.clientExpand = !this.clientExpand;
                    this.locationExpanded = false;
                    this.brokerExpand = false;
                    this.logExpanded = false;
                    this.calculation=false;
                    this.userExpanded = false;
                    break;

            default:
                this.logExpanded = false;
                this.calculation = false;
                this.userExpanded = false;
                this.locationExpanded = false;
                this.brokerExpand = false;
                this.clientExpand=false
                this.drawerClicked.emit();
                break;
        }
    }
data:String="0 8 * * */Monday";
    constructor(
        private authService: AuthenticationService,
        private reportService:ReportService,
        private router: Router,
        private jwt:JWTService,
        private dialog: Dialog
    ) { }


    generateWeeklyRpeort= () =>{
      Swal.fire({
        title: 'Create Report',
        text: 'Generate Weekly Report And Mail The Report',
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Generate',
        confirmButtonColor: '#C3343A',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#7D7E80',
      }).then((confirmation) => {
        if (confirmation.isConfirmed) {
          this.reportService.generateReport(this.data).subscribe(()=>{
            // console.log("Generated Successfully");
          })
        }
      });
      // const dialogRef = this.dialog.open(ReportDialogComponent)
        // this.reportService.generateReport(this.data).subscribe(()=>{
        //   console.log("Generated Successfully");
        // })
    }

    logOut = () => {
        this.authService.logOut().subscribe((result: any) => {
            if (result.Message === 'user logout sucessfully!') {
                // localStorage.removeItem('auth-token');
                sessionStorage.removeItem('token');
                this.router.navigate(['/auth']);
            }
        });
    }
}
