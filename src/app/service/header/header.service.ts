import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    constructor(
        // private deviceDetectorService: DeviceDetectorService
    ) {}

    updateHeader = () => {
        // let authToken: string = `${localStorage.getItem('auth-token')}`;
        let authToken: string = `${sessionStorage.getItem('token')}`;
        // let deviceType: string = this.deviceDetectorService.detectDevice();
        let headers: HttpHeaders = new HttpHeaders({
            // 'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InZpa3JhbnRAbW9iaWNsb3VkLmNvLmluIiwiX2lkIjoiNjQ4NmMwMmVjZTVlYjQ4ODZhNGFiYTBjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzExNDM3ODIxfQ.DE9bVVBzHwdqP1vCSqgXyOKMQs-WTbWgN0J8udGG3_w', //admin
            'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InZ2ZWxwZXJvb2tAZ21haWwuY29tIiwiX2lkIjoiNjQ4NmQxOWZkYjgzZGRmY2IyYTY1YzkyIiwicm9sZSI6InNhbGVzIiwiaWF0IjoxNzExNTE5MTYwfQ.9cIUqwYTKUn5GYOPfc89HIpFYA3g18njZ14PB4jJHZU' //sales
            // 'devicetype': deviceType
        });

        let httpOptions: any = {
            headers: headers
        }
        // console.log(httpOptions,"SDFGHJ")
        return httpOptions;

    };
}
