import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { LogService } from "src/app/service/log/log.service";
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

    displayedColumns: string[] = ['proposalId', 'logMessage', 'clientName', 'date', 'action'];
    dataSource!: MatTableDataSource<ProposalLogData>;

    @ViewChild(MatTable) table!: MatTable<ProposalLogData>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private logService: LogService,
        private router: Router
    ) { }
    
    ngOnInit(): void {
        this.getAllLogs();
    }

    applyFilter = (event: Event) => {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getAllLogs = () => {
        this.logService.getAllLogs().subscribe({
            next: (result: any) => {
                // console.log(result);
                this.tableDataSource(result);
            }
        })
    }

    tableDataSource = (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
    }

    viewDetails = (Id: string) => {
        this.router.navigate(['/new-proposal', 'proposal-preview', Id]);
    }
}