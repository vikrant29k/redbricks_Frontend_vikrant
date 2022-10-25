import { Component } from "@angular/core";
import { faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons"

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class AuthLoginComponent {
    visibility = faEye;
    visibility_off = faEyeSlash;
}