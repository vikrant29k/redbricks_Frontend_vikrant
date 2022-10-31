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

    constructor(
        private http: HttpClient,
        private toster: HotToastService,
        private headerService: HeaderService
    ) { }

    initializeProposal = () => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.get(this.baseUrl + 'init', httpOptions).pipe(
            this.toster.observe({
                success: 'Proposal Initialized',
                loading: 'Initialzing Proposal...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    addClientInfo = (clientInfo: any, id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'addClientInfo/' + id, clientInfo, httpOptions).pipe(
            this.toster.observe({
                success: 'Proposal data saved Successfully',
                loading: 'Saving proposal data...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    addRequirement = (requirementData: any, id: string) => {
        let httpOptions = this.headerService.updateHeader();
        return this.http.post(this.baseUrl + 'addRequirement/' + id, requirementData, httpOptions).pipe(
            this.toster.observe({
                success: 'Requirement Saved Successfully',
                loading: 'Saving requirement...',
                error: ({ error }) => `${error.Message}`
            })
        );
    }

    sendOtp = (mobileNo: string, Id: string) => {
        return this.http.post(this.baseUrl + 'send-otp/' + Id, { mobileNo: mobileNo }).pipe(
            this.toster.observe({
                success: 'OTP send seccessfylly',
                loading: 'Sending OTp...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    verifyOtp = (OTP: any,Id: string) => {
        return this.http.post(this.baseUrl + 'verify-otp/' + Id, {OTP: OTP}).pipe(
            this.toster.observe({
                success: 'OTP verified seccessfylly',
                loading: 'verifying OTP...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    generateLayout = (Id: string, selectFrom: string) => {
        return this.http.get(this.baseUrl + 'layout/' + Id + '/' + selectFrom).pipe(
            this.toster.observe({
                success: 'Layout Preview generated successfully',
                loading: 'generating Layut...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

    generateProposal = (Id: string, selectFrom: string) => {
        return this.http.get(this.baseUrl + 'generate/' + Id + '/' + selectFrom).pipe(
            this.toster.observe({
                success: 'Proposal generated successfully',
                loading: 'generating Proposal...',
                error: ({ error }) => `${error.Message}`
            })
        )
    }

}