import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication/authentication.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class AuthLoginComponent implements OnInit{

    showPassword: boolean = false;

    forceLogin: boolean = false;

    constructor(
        private AuthService: AuthenticationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        
    }

    loginForm = new FormGroup({
        'userName': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', Validators.required)
    });

    get userName() {
        return this.loginForm.get('userName');
    }
    get password() {
        return this.loginForm.get('password');
    }

    onSubmit = async () => {
        if (this.loginForm.invalid) {
            return;
        }
        let loginData = { ...this.loginForm.value, forceLogin: this.forceLogin };
        (await this.AuthService.login(loginData)).subscribe({
            next: (result: any) => {
                if (result.Message === 'User Login Successfull!') {
                    localStorage.setItem('auth-token', result.Token);
                    console.log(result);
                    this.router.navigate(['/'])
                }
            },
            error: (result: any) => {
                if (result.error.Message === "User Have Already Logged In From Another Device!") {
                    console.log('Already logged In');
                    this.forcedLogin();
                }
            }
        })
    }

    forcedLogin = () => {
        Swal.fire({
            title: 'Already Logged In!',
            text: 'you have already logged In from another device. do you want to log out from previous device and continue loggin on this device ?',
            icon: 'warning',
            confirmButtonText: 'Continue Log In',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            showConfirmButton: true
        }).then((confirmation) => {
            if (confirmation.isConfirmed) {
                this.forceLogin = true;
                this.onSubmit();
            }
        })
    }
}