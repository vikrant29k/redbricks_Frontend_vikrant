import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
showPassword: any;



  constructor() { }
  
  userForm = new FormGroup<any>({
    'firstName': new FormControl('', Validators.required),
    'lastName': new FormControl('', Validators.required),
    'mobileNo': new FormControl('', Validators.required),
    'dateOfBirth': new FormControl('', Validators.required),
    'designation': new FormControl('', Validators.required),
    'role': new FormControl('', Validators.required),
    'address': new FormControl('', Validators.required),
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

  }
  
  
}