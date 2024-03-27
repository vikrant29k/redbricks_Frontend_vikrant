import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './service/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Redbricks_Frontend';
  constructor(  private authService: AuthenticationService){}
  ngOnInit(): void {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }
  onBeforeUnload = (): void => {
    // Send a request to the backend to remove the device ID
    this.logOut();
  }
  logOut = () => {
      this.authService.logOut().subscribe((result: any) => {
          if (result.Message === 'user logout sucessfully!') {
              // localStorage.removeItem('auth-token');
              sessionStorage.removeItem('token');

          }
      });
  }
}
