import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HotToastService } from '@ngneat/hot-toast';
import { HeaderService } from '../header/header.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
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
  ) {}

  initializeProposal = (data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'init/' + data, httpOptions).pipe(
      this.toster.observe({
        success: 'Proposal Initialized',
        loading: 'Initializing Proposal...',
        error: ({ error }) => `${error.Message}`,
      })
    );
  };

  addClientInfo = (clientInfo: any, id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'addClientInfo/' + id, clientInfo, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Proposal Data Saved Successfully',
          loading: 'Saving Proposal Data...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  addRequirement = (requirementData: any, id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'addRequirement/' + id, requirementData, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Requirement Saved Successfully',
          loading: 'Saving Requirement...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  resolveConflict = (id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .get(this.baseUrl + 'resolveConflict/' + id, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Conflict Resolved Successfully',
          loading: 'Resolving Conflict...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };
  // sendOtp = (mobileNo: string, Id: string) => {
  //     let httpOptions = this.headerService.updateHeader();
  //     return this.http.post(this.baseUrl + 'send-otp/' + Id, { mobileNo: mobileNo },httpOptions).pipe(
  //         this.toster.observe({
  //             success: 'OTP Send Successfully',
  //             loading: 'Sending OTP...',
  //             error: ({ error }) => `${error.Message}`
  //         })
  //     )
  // }

  // verifyOtp = (OTP: any, Id: string) => {
  //     let httpOptions = this.headerService.updateHeader();
  //     return this.http.post(this.baseUrl + 'verify-otp/' + Id, {OTP: OTP},httpOptions).pipe(
  //         this.toster.observe({
  //             success: 'OTP Verified Successfully',
  //             loading: 'Verifying OTP...',
  //             error: ({ error }) => `${error.Message}`
  //         })
  //     )
  // }

  generateLayout = (Id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .get(this.baseUrl + 'layout/' + Id , httpOptions)
      // .pipe(
      //   this.toster.observe({
      //     success: 'Layout Preview Generated Successfully',
      //     loading: 'Generating Layout...',
      //     error: ({ error }) => `${error.Message}`,
      //   })
      // );
  };

  generateProposal = (Id: string, selectFrom: string, data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(
        this.baseUrl + 'generate/' + Id + '/' + selectFrom,
        data,
        httpOptions
      )
      .pipe(
        this.toster.observe({
          success: 'Proposal Generated Successfully',
          loading: 'Generating Proposal...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  getAllProposal = () => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl + 'getAll', httpOptions).pipe(
      this.toster.observe({
        success: 'Proposal List Loaded Successfully',
        loading: 'Loading All Old Proposal Data...',
        error: ({ error }) => `${error.Message}`,
      })
    );
  };

  getProposalById = (Id:any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.get(this.baseUrl+'getProposalById/'+Id,httpOptions).pipe(
      this.toster.observe({
        success: 'Proposal Loaded Successfully',
        loading: 'Loading Proposal...',
        error: ({ error }) => `${error.Message}`,
      })
    );
  }
  updateProposalById = (Id:any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http.post(this.baseUrl+'updateProposalId/'+Id,httpOptions).pipe(
      // this.toster.observe({
      //   success: 'Proposal ID Updated Successfully',
      //   loading: 'Loading Proposal...',
      //   error: ({ error }) => `${error.Message}`,
      // })
    );
  }

  checkSeatAvailability = (Id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .get(
        this.baseUrl + 'checkSeatAvailabilityAndConsolidatedSeats/' + Id,
        httpOptions
      )
      .pipe(
        this.toster.observe({
          success: 'Data Loaded Successfully',
          loading: 'Loading Data...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  approveProposal = (Id: string, data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'approveProposal/' + Id, data, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Propsal Approved Successfully',
          loading: 'Approving Propsal...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  lockProposal = (Id: string, data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'lockProposal/' + Id, data, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Propsal Locked Successfully',
          loading: 'Locking Propsal...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  escalateClosure = (Id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'esclateToClosure/' + Id, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Sent For Closure',
          loading: 'Sending For Closure...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  finalOfferAmount = (Id: string) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .get(this.baseUrl + 'finalOfferAmmount/' + Id, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Final Offer Generated',
          loading: 'Generating Final Offer Amount...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  updateOfferAmount = (Id: string, data: any) => {
    let httpOptions = this.headerService.updateHeader();
    return this.http
      .post(this.baseUrl + 'esclateToClosure/' + Id, data, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Final Offer Updated',
          loading: 'Updating Final Offer Amount...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  };

  viewLayoutOnSales = (Id:string)=>{
    return this.http
      .get(this.baseUrl + 'viewLayoutSales/' + Id)
      .pipe(
        this.toster.observe({
          success: 'Layout View',
          loading: 'Loading...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  }

  saveImage(Id:string,data:any): Observable<any>{
    let httpOptions = this.headerService.updateHeader();
    
    return this.http
      .post(this.baseUrl + 'saveImage/' + Id, data, httpOptions)
      .pipe(
        this.toster.observe({
          success: 'Layout Saved Successfully',
          loading: 'Saving Layout...',
          error: ({ error }) => `${error.Message}`,
        })
      );
  }
}
