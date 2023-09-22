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
                success: 'Broker Added Successfully',
                loading: 'Adding Broker...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    getAllBroker = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
            this.toster.observe({
                success: 'Broker Data Loaded Successfully',
                loading: 'Loading Broker Data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    updateBroker = (id: string, brokerData: BrokerData) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.put(this.baseUrl + 'update/' + id, brokerData, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker Data Updated Successfully',
                loading: 'Updating Broker Data...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    deleteBroker = (id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.delete(this.baseUrl + 'delete/' + id, httpOptions).pipe(
            this.toster.observe({
                success: 'Broker Data Deleted',
                loading: 'Deleting Broker Data...',
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
        return this.http.get(this.baseUrl + 'getById/' + brokerId, httpOptions);
    }
    getProposalCount = (id:string) =>{
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(environment.baseUrl+'brokerDashboard/proposalCount/'+id,httpOptions).pipe(
            this.toster.observe({
               success:'Preposal Data Of Broker Loaded Successfully',
               error: ({ error }) => `${error.Message}`

            })
        )
    }

    getBrokerProposalAvg = (id:string,data:any) =>{
        let httpOptions = this.headerService.updateHeader()
        return this.http.post(environment.baseUrl+'brokerDashboard/average/'+id,data,httpOptions)
    
    }
    getProposalCountAsPerLocation = (id:string) =>{
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(environment.baseUrl+'brokerDashboard/locations/'+id,httpOptions)
    }
    getProposalSelsePerson = (id:string) =>{
     let httpOptions = this.headerService.updateHeader();
     return this.http.get(environment.baseUrl+'brokerDashboard/salesPersons/'+id,httpOptions)
    }
    getMailReportOfBroker = () =>{
        let httpOptions =this.headerService.updateHeader()
        return this.http.get(environment.baseUrl+'report/brokerReport',httpOptions).pipe(
            this.toster.observe({
                success:'Email Send Successfully'
            })
        )
    }
}