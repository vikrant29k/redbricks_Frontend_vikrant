import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserService } from 'src/app/service/users/user.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  showPassword: any;
  editMode: boolean = false;
  passwordUpdated: boolean = false;
  passwordUpdatedAlertShowed: boolean = false;
  userDataBeforeEdit: any;
  salesHeads: any = [];



  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  userForm = new FormGroup<any>({
    'firstName': new FormControl('', Validators.required),
    'lastName': new FormControl('', Validators.required),
    'mobileNo': new FormControl('', Validators.required),
    'dateOfBirth': new FormControl('', Validators.required),
    'designation': new FormControl('', Validators.required),
    'role': new FormControl('', Validators.required),
    'userName': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  })


  ngOnInit(): void {
    this.watchFormForChanges();
    this.getUserDataToEdit();
  }

  getUserDataToEdit = () => {
    let Id = this.route.snapshot.params['id'];
    if (Id) {
      this.userService.getUserById(Id).subscribe({
        next: (result: any) => {
          this.editMode = true;
          delete result.password;
          this.userDataBeforeEdit = result;
          this.userForm.patchValue(result);
          this.password?.removeValidators(Validators.required);
        }
      })
    }
  }



  get role() {
    return this.userForm.get('role');
  }

  get password() {
    return this.userForm.get('password');
  }

  watchFormForChanges = () => {
    this.role?.valueChanges.subscribe(() => {
      if (this.role?.value === 'sales') {
        this.userService.getSalesHead().subscribe({
          next: (result: any) => {
            this.salesHeads = [...result];
            this.userForm.addControl('salesHead', new FormControl(''));
            if (this.editMode) {
              console.log(this.userDataBeforeEdit);
              this.userForm.get('salesHead')?.patchValue(this.userDataBeforeEdit.salesHead);
              this.cd.detectChanges();
            }
          }
        })
      }
      else {
        if (this.userForm.get('salesHead')) {
          this.userForm.removeControl('salesHead');
        }
      }
    })
    this.password?.valueChanges.subscribe((a) => {
      if (this.editMode) {
        if (this.password?.value === '') {
          if (this.password.hasValidator(Validators.required)) {
            this.password.removeValidators([Validators.required]);
          }
        }
        else {
          if (!this.password?.hasValidator(Validators.required)) {
            this.passwordUpdateAlert();
            this.passwordUpdated = true;
            this.password?.addValidators([Validators.required]);
          }
        }
      }
    })
  }

  onSubmit = () => {
    if (this.editMode) {
      if (!this.passwordUpdated || this.password?.value === '') {
        delete this.userForm.value?.['password'];
      }
      Swal.fire({
        title: 'Update User Data',
        text: 'Are you sure you want to update user data',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes! Proceed',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#C3343A',
        cancelButtonColor: '#7D7E80'
      }).then((confirmation) => {
        if (confirmation.isConfirmed) {
          let Id = this.route.snapshot.params['id'];
          let userUpdateData = { ...this.userForm.value, _id: Id };
          this.userService.updateUser(userUpdateData).subscribe({
            next: () => {
              this.router.navigate(['/admin', 'users', 'user-list']);
            }
          })
        }
      })
    }
    else {
      if (this.userForm.invalid) {
        return;
      }
      else {
        this.userService.addUser(this.userForm.value).subscribe({
          next: (result: any) => {
            this.router.navigate(['/admin', 'users', 'user-list']);
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          }
        })
      }
    }
  }

  passwordUpdateAlert = () => {
    if (this.passwordUpdated === false && this.passwordUpdatedAlertShowed === false) {
      Swal.fire({
        title: 'Password Update',
        text: 'If you don\'t want to update your password leave this field blank!',
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#C3343A'
      })
    }
    this.passwordUpdatedAlertShowed = true;
  }

  cancelEditMode = () => {
    this.editMode = false;
    this.router.navigate(['/admin', 'users', 'user-list'])
  }


}