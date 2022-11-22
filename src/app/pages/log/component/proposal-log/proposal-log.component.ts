import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { LogService } from "../../../../service/log/log.service";
import { Router } from "@angular/router";

export interface ProposalLogData {
    _id: any;
    proposalId: string;
    clientName: string;
    logMessage: string;
    createdAt: Date;
    updatedAt: Date;

}

@Component({
    selector: 'log-proposal-log',
    templateUrl: './proposal-log.component.html',
    styleUrls: ['./proposal-log.component.scss']
})
export class LogProposalLog implements OnInit {
    logData:any;

    displayedColumns: string[] = ['proposalId', 'logMessage', 'clientName', 'date', 'action'];
    dataSource!: MatTableDataSource<ProposalLogData>;

    @ViewChild(MatTable) table!: MatTable<ProposalLogData>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
// arr = this.logService.getAllLogs().subscribe;
    constructor(
        private logService: LogService,
        private router: Router
    ) { }
    
    ngOnInit(): void {
        this.getAllLogs();
        // this.readntransform();
    }
    getExpiredOrNot = (date: any) => {
        date = new Date(date);
        let current = new Date();
      let diff = current.getTime() - date.getTime(); 
      let dayDiff = diff / (1000 * 60 * 60 * 24); 

      if(dayDiff > 90){
        return true;
      }
      else{
        return false;
      }
    }


updatetable = () =>{

}


    applyFilter = (event: Event) => {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    sortdate = (filter:string) => {
        if(filter==='expired'){
            this.displayExpiredData();
          }
          else if(filter==='not'){
              this.displayNotExpiredData();
          }
          else{
           this.tableDataSource(this.logData);
          }

    }
   displayAllData=(result:any)=>{
    let a = result.map((d:any) => {
        let data = d;
        data = {...data,expired: this.getExpiredOrNot(data.createdAt)};
        return data;
       });
       return a;
   }
   displayExpiredData=async()=>{
    let a:any = [];
    this.logData.forEach((d:any)=>{
        if(d.expired===true){
           a=[...a,d];
        }
    });
    console.log(a);
    this.tableDataSource(a);
   }
   displayNotExpiredData=async()=>{
    let a:any =[];
    this.logData.forEach((d:any)=>{
        if(d.expired===false){
            a=[...a,d];
        }
    }); 
    console.log(a);
    this.tableDataSource(a);
   }
    

    getAllLogs = (filter:string='all') => {
        this.logService.getAllLogs().subscribe({
            next: (result: any) => {
                result.reverse();
                let a =this.displayAllData(result);
                // console.log(result);
                this.logData=[...a];
                
                this.tableDataSource(a);
            }
        })
    }
  

    tableDataSource = (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        // this.table.renderRows();
    }

    viewDetails = (Id: string) => {
        let currentRoute = this.router.url.split('/')[1];
        if (currentRoute === 'sales') {
            this.router.navigate(['/sales', 'new-proposal', 'proposal-preview', Id]);
        }
        else {
            this.router.navigate(['/admin', 'new-proposal', 'proposal-preview', Id]);
        }
    }
}