import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private storageSub = new Subject<string>;

    setItem = (key: string, value: string) => {
        localStorage.setItem(key,value);
        this.storageSub.next('changed');
    }
    
    removeItem = (key: string) => {
        localStorage.removeItem(key);
        this.storageSub.next('changed');
    }

    watchStorage = () => {
        return this.storageSub.asObservable();
    }

    getItem = (key: string) => {
        return localStorage.getItem(key);
    }
}