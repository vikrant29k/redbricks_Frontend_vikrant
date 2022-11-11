import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ElectronApiService {
    
    getMacAddress = async () => {
        let macAddress = await (<any> window).electronAPI.getMac().then((data: any) => {
            return data;
        })
        return macAddress;
    }
}