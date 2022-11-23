import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HotToastService } from "@ngneat/hot-toast";
import { HeaderService } from "../header/header.service";

@Injectable({
    providedIn: 'root'
})
export class ProposalService { 
    
    baseUrl: string = environment.baseUrl + 'proposal/';
    consolidatedSeats: boolean = false;
    seatAvailability: boolean = true;
    conflict: boolean = false;
    AvailableNoOfSeats: number = 0;
    TotalNoOfSets: number = 0;

    constructor(
        private http: HttpClient,
        private toster: HotToastService,
        private headerService: HeaderService
    ) { }

    initializeProposal = (data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'init/'+ data, httpOptions).pipe(
            this.toster.observe({
                success: 'Proposal Initialized',
                loading: 'initializing Proposal...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    addClientInfo = (clientInfo: any, id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'addClientInfo/' + id, clientInfo, httpOptions).pipe(
            this.toster.observe({
                success: 'Proposal Data Saved Successfully',
                loading: 'Saving Proposal Data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    addRequirement = (requirementData: any, id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'addRequirement/' + id, requirementData, httpOptions).pipe(
            this.toster.observe({
                success: 'Requirement Saved Successfully',
                loading: 'Saving Requirement...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    sendOtp = (mobileNo: string, Id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'send-otp/' + Id, { mobileNo: mobileNo },httpOptions).pipe(
            this.toster.observe({
                success: 'OTP Send Successfully',
                loading: 'Sending OTP...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    verifyOtp = (OTP: any, Id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'verify-otp/' + Id, {OTP: OTP},httpOptions).pipe(
            this.toster.observe({
                success: 'OTP Verified Successfully',
                loading: 'Verifying OTP...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    generateLayout = (Id: string, selectFrom: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'layout/' + Id + '/' + selectFrom, httpOptions).pipe(
            this.toster.observe({
                success: 'Layout Preview Generated Successfully',
                loading: 'Generating Layout...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    generateProposal = (Id: string, selectFrom: string, data: any) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'generate/' + Id + '/' + selectFrom, data , httpOptions).pipe(
            this.toster.observe({
                success: 'Proposal Generated Successfully',
                loading: 'Generating Proposal...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    getAllProposal = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
            this.toster.observe({
                success: 'All Old Proposal List Loaded successfully',
                loading: 'Loading All Old Proposal Data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

}