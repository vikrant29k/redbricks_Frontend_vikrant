import { Injectable } from "@angular/core";
import { DeviceDetectorService as DeviceDetector } from "ngx-device-detector";

@Injectable({
    providedIn: 'root'
})
export class DeviceDetectorService {
    constructor(private deviceDetector: DeviceDetector) { }

    detectDevice = () => {
        if (this.deviceDetector.isDesktop()) {
            return 'Desktop'
        }
        else if (this.deviceDetector.isTablet()) {
            return 'Tablet'
        }
        return 'Mobile'
    }
}