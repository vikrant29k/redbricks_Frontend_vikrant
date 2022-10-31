import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceDetectorService } from "../device-detector/device-detector.service";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    constructor(
        private deviceDetectorService: DeviceDetectorService
    ) {}

    updateHeader = () => {
        let authToken: string = `${localStorage.getItem('auth-token')}`;
        let deviceType: string = this.deviceDetectorService.detectDevice();
        let headers: HttpHeaders = new HttpHeaders({
            'auth-token': authToken,
            'devicetype': deviceType
        });

        let httpOptions: any = {
            headers: headers
        }

        return httpOptions;

    };
}