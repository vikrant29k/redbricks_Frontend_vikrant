import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "src/app/service/profile/profile.service";
import Swal from "sweetalert2";

@Component({
    selector: 'profile-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss']
})
export class ProfileProfileDetailComponent implements OnInit {

    editMode: boolean = false;
    passwordUpdated: boolean = false;
    showPassword: boolean = false;
    passwordUpdateAlertShowed: boolean = false;

    userDataBeforeEdit: any;

    profileForm = new FormGroup({
        'firstName': new FormControl('',Validators.required),
        'lastName': new FormControl('',Validators.required),
        'mobileNo': new FormControl('',Validators.required),
        'dateOfBirth': new FormControl('',Validators.required),
        'designation': new FormControl('',Validators.required),
        'role': new FormControl('',Validators.required),
        'address': new FormControl('',Validators.required),
        'userName': new FormControl('',[Validators.required,Validators.email]),
        'password': new FormControl({value: '', disabled: true}),
    })

    constructor(
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
       
        this.getProfileData();
        
    }

    get password() {
        return this.profileForm.get('password');
    }

    watchForPasswordChange = () => {
        this.password?.valueChanges.subscribe((a) => {
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
        })
    }

    onSubmit = () => {
        let updateProfileData = this.profileForm.value;
        if (this.passwordUpdated === false || this.password?.value === '') {
            delete updateProfileData.password
        }
        Swal.fire({
            title: 'Update User Profile',
            text: 'Are you sure you want to update your profile',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Yes! Proceed',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#C3343A',
            cancelButtonColor: '#7D7E80'
        }).then((confirmation) => {
            if (confirmation.isConfirmed) {
                this.profileService.updateUserProfile(updateProfileData).subscribe({
                    next: (result: any) => {
                        this.disableEditMode();
                        this.getProfileData();
                    }
                }) 
            }
        })
        
    }

    passwordUpdateAlert = () => {
        if (this.passwordUpdated === false && this.passwordUpdateAlertShowed === false) {
            Swal.fire({
                title: 'Password Update',
                text: 'If you don\'t want to update your password leave this field blank!',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Got it!',
                confirmButtonColor: '#C3343A'
            })
        }
        this.passwordUpdateAlertShowed = true;
    }

    enablePassword = () => {
        this.password?.enable();
    }

    getProfileData = () => {
        this.profileForm.disable();
        this.profileService.getUserProfile().subscribe({
            next: (result: any) => {
                delete result.password;
                this.profileForm.patchValue(result);
            }
        })
    }

    enableEditMode = () => {
        this.editMode = true;
        this.userDataBeforeEdit = this.profileForm.value;
        this.profileForm.enable();
        this.watchForPasswordChange();
    }

    disableEditMode = () => {
        this.editMode = false;
        this.profileForm.disable();
        this.profileForm.patchValue(this.userDataBeforeEdit);
    }

}