import { OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ProposalService } from "src/app/service/proposal/proposal.service";

export interface OldProposalData {
    _id: any;
    createdAt: Date;
    updatedAt: Date;
}

@Component({
    selector: 'old-proposal-table',
    templateUrl: './old-proposal-table.component.html',
    styleUrls: ['./old-proposal-table.component.scss']
})
export class OldProposalTableComponent implements OnInit {

    displayedColumns: string[] = ['proposalId','date','esclateToCloser', 'action'];
    dataSource!: MatTableDataSource<OldProposalData>;

    @ViewChild(MatTable) table!: MatTable<OldProposalData>;
    @ViewChild(MatPaginator) Paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private router: Router,
        private proposalService: ProposalService
    ) { }
    
    ngOnInit(): void {
        this.getAllProposal();
    }

    applyFilter = (event: Event) => {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getAllProposal = () => {
        this.proposalService.getAllProposal().subscribe({
            next: (result: any) => {
                result = result.reverse();
                this.tableDataSource(result);
            }
        })
    }

    tableDataSource = (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.Paginator;
        // this.table.renderRows();
    }

    esclateToCloser = (Id: string) => {
        // old - proposal / closure / asdfas
        this.router.navigate(['/sales','old-proposal', 'closure', Id]);
    }

    viewDetails = (Id: string) => {
        this.router.navigate(['/sales','new-proposal', 'proposal-preview', Id]);
    }
}