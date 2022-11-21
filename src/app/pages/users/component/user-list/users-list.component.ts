import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/service/users/user.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { Router } from "@angular/router";

export interface UserData {
  _id?: any,
  firstName: String,
  lastName: String,
  mobile: String,
  dateOfBirth: Date,
  category: String,
  aadharNo: String,
  panNo: String,
  role: String,
  address: String,
  city: String,
  userName: String,
  password: String
}

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  editMode: boolean = false;


  ngOnInit(): void {
    this.getAllUsers();
  }


  Users: any;
  // = [
  //   { Sr: 1, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 2, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 3, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 4, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 5, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 6, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 7, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 8, firstName: 'Sales', lastName: 'Head', mobile: 9834870884, email: 'salesHead@mobicloud.co.in', role: 'salesHead'},
  //   { Sr: 9, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 10, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 11, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'rm@mobicloud.co.in', role: 'RM'},
  //   { Sr: 12, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 13, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 14, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 15, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 16, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 17, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 18, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 19, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 20, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 21, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'},
  //   { Sr: 22, firstName: 'Manprit', lastName: 'TIwari', mobile: 9834870884, email: 'manprit@mobicloud.co.in', role: 'Admin'}
  // ];

  displayedColumns: string[] = ['Sr', 'firstName', 'lastName', 'mobile', 'email', 'role', 'edit', 'delete'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatTable) table!: MatTable<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) {

  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getAllUsers() {
    this.userService.getAllUser().subscribe({
      next: (result: any) => {
        result.reverse();
        this.Users = result;
        this.tableDataSource(this.Users);
      },
      error: (err: any) => {
        this.authService.handleAuthError(err);
      }
    })
  }
  tableDataSource(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.cd.detectChanges();
    this.table.renderRows();
  }

  deleteUser(id: string) {
    Swal.fire({
      title: 'Delete Confirm!',
      text: 'Are you sure you want to Delete this User?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.getAllUsers();
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          }
        })
      }
    })
  }

  editUser(id: any) {
    Swal.fire({
      title: 'Edit Confirm!',
      text: 'Are you sure you want to Edit this User Data?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes! Proceed',
      confirmButtonColor: '#C3343A'
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.router.navigate(['/admin','users','add-users',id])
      }
    })
    this.editMode = true;
    this.userService.userIdToUpdate = id;
    // this.openDialog();
  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(AddUsersComponent, {
  //     panelClass: 'customDialog',
  //     data: { editMode: this.editMode }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.editMode = false;
  //     this.getAllUsers();
  //   });
  // }
}
