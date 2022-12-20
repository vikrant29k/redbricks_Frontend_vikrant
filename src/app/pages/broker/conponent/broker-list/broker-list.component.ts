import { ChangeDetectorRef } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { BrokerData, BrokerService } from "src/app/service/broker/broker.service";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import Swal from "sweetalert2";
import { OnInit } from "@angular/core";



@Component({
    selector: 'broker-broker-list',
    templateUrl: './broker-list.component.html',
    styleUrls: ['./broker-list.component.scss']
})
export class BrokerBrokerListComponent implements OnInit{

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatTable) table!: MatTable<BrokerData>;

    dataSource!: MatTableDataSource<BrokerData>;
    displayedColumns: string[] = ['brokerType', 'brokerCategory', 'SPOCName', 'SPOCEmail','edit','delete'];


    constructor(
        private cd: ChangeDetectorRef,
        private router: Router,
        private brokerService: BrokerService,
        private authService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.getAllBroker();
    }

    tabelDataSource = (data: BrokerData[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.cd.detectChanges();
        this.table.renderRows();
    }

    getAllBroker = () => {
        this.brokerService.getAllBroker().subscribe({
            next: (result: unknown) => {
                this.tabelDataSource(result as BrokerData[]);
            },
            error: (err: unknown) => {
                this.authService.handleAuthError(err);
            }
        })
    }

    deleteBroker = (id: string) => {
        Swal.fire({
            title: 'Delete Broker',
            text: 'Are you sure you want to delete this broker?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#C4434A',
        }).then((confirmation) => {
            if (confirmation.isConfirmed) {
                this.brokerService.deleteBroker(id).subscribe({
                    next: (result: unknown) => {
                        this.getAllBroker();
                    },
                    error: (err: unknown) => {
                        this.authService.handleAuthError(err);
                    }
                })
            }
        })
    }

    applyFilter = (event: Event) => {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editBroker = (id: string) => {
        this.router.navigate(['/admin', 'broker', 'update-borker', id]);
    }


    
}