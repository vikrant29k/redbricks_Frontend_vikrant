import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HeaderService } from "../header/header.service";
import { HttpClient } from "@angular/common/http";
import { HotToastService } from "@ngneat/hot-toast"


export interface BrokerData {
    _id?: string,
    brokerType: string,
    brokerCategory: string,
    SPOCName: string,
    SPOCEmail: string,
    SPOCNumber?: string
}

@Injectable({
    providedIn: 'root'
})
export class BrokerService {

    baseUrl = environment.baseUrl + 'broker/';

    constructor(
        private http: HttpClient,
        private headerService: HeaderService,
        private toster: HotToastService
    ) { }

    addBroker = (brokerData: BrokerData) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'create', brokerData, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker added successfully',
                loading: 'Adding Broker...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    getAllBroker = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
            this.toster.observe({
                success: 'Broker data loaded successfully',
                loading: 'Loading broker data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    updateBroker = (id: string, brokerData: BrokerData) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.put(this.baseUrl + 'update/' + id, brokerData, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker data updated successfully',
                loading: 'Updating broker data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    deleteBroker = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker data deleted',
                loading: 'Deleting broker data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    getBrokerTypeList = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getBrokerList', httpOptions);
    }

    getBrokerCategoryList = (brokerType: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getBrokerCategoryList/' + brokerType, httpOptions)
    }

    getBrokerById = (brokerId: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getById/' + brokerId, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker data loaded successfully',
                loading: 'Loading Broker data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }
}