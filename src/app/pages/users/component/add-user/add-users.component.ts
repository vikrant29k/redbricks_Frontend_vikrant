import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserService } from 'src/app/service/users/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  
  showPassword: any;
  


  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
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
  }

  get role() {
    return this.userForm.get('role');
  }

  watchFormForChanges = () => {
    this.role?.valueChanges.subscribe(() => {
      if (this.role?.value === 'sales') {
        this.userForm.addControl('salesHead', new FormControl(''));
      }
      else {
        if (this.userForm.get('salesHead')) {
          this.userForm.removeControl('salesHead');
        }
      }
    })
  }

  onSubmit = () => {
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