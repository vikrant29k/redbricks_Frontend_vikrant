import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { BrokerService } from 'src/app/service/broker/broker.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import { UserService } from 'src/app/service/users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'new-proposal-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss'],
})
export class NewProposalClientInfoComponent implements OnInit {
  // disabl = new FormControl({ value: null, disabled: true });
  proposalId!: string;
  locations = new Set<string>();
  centers = new Set<string>();
  address = new Set<string>();
  salesHeads: any[] = [];
  category: any;
  // IPC: any = ['JLL', 'CBRE', 'C & W', 'KF', 'Colliers', 'Savills', 'other'];
  // Non_IPC: any = ['CityInfo', 'EHRPCL', 'other'];
  // Direct: any = "Client Name";
  // brokerAll:any;
  brokerTypeList: any;
  brokeCategoryList: any;
  getBrokerType: any;
  // brokerCategory = {
  //     'IPC': ['JLL', 'CBRE', 'C & W', 'KF', 'Colliers', 'Savills', 'other'],
  //     'Non-IPC': ['CityInfo', 'EHRPCL', 'other']
  // }

  clientInfoForm = new FormGroup<any>({
    location: new FormControl('', Validators.required),
    center: new FormControl('', Validators.required),
    address: new FormControl(''),
    floor:new FormControl('', Validators.required),
    locationId:new FormControl('',Validators.required),
    // 'spocName': new FormControl(''),
    // 'clientName': new FormControl(''),
    brokerType: new FormControl('', Validators.required),
    // 'brokerCategory': new FormControl('', Validators.required),
    // 'brokerCategoryother': new FormControl(''),
    // 'SpocotherName': new FormControl(''),
    // 'SpocotherEmail': new FormControl(''),
    // 'clientEmail':new FormControl('')
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private proposalService: ProposalService,
    private authService: AuthenticationService,
    private userService: UserService,
    private brokerService: BrokerService
  ) {}

  getBrokerTypeList() {
    this.brokerService.getBrokerTypeList().subscribe((res) => {
      this.brokerTypeList = res;
      // console.log(this.brokerTypeList, 'type list');
    });
  }
  getBrokerCategoryList(res1: string) {
    this.brokerService.getBrokerCategoryList(res1).subscribe((res) => {
      this.brokeCategoryList = res;
      if (res1 == 'IPC' || res1 == 'Non-IPC') {
        this.clientInfoForm.addControl(
          'brokerCategory',
          new FormControl('', Validators.required)
        );
        if(this.clientInfoForm.get('brokerCategory')){
          this.watchValueChangesInBrokerCategory();
        }
      } else {
        this.clientInfoForm.removeControl('brokerCategory');
        // this.clientInfoForm.removeControl('spocName');
        // this.clientInfoForm.removeControl('spocEmail');
      }
      // console.log(this.brokeCategoryList, 'categor list');
    });
  }
  directClient(res: string) {
    if (res === 'direct') {
      this.clientInfoForm.addControl('clientName',new FormControl(''));
      // this.clientInfoForm.addControl('clientEmail', new FormControl('', Validators.required));
    } else {
      this.clientInfoForm.removeControl('clientName');
      // this.clientInfoForm.removeControl('clientEmail');
    }
  }
  // addSpocNameEmail() {
  //   if (this.clientInfoForm.value.brokerCategory === 'other') {
  //     this.clientInfoForm.addControl('SPOCName',new FormControl('', Validators.required));
  //     this.clientInfoForm.addControl('SPOCEmail',new FormControl('', Validators.required));
  //   } else {
  //     // this.clientInfoForm.removeControl('spocName');
  //     // this.clientInfoForm.removeControl('spocEmail');
  //   }
  // }
  onSubmit = () => {
    if (this.clientInfoForm.invalid) {
      return;
    }
    Swal.fire({
      title: 'Initialized Proposal And Add Client Info',
      text: "Once you initialized proposal and added client Info it can't be undone",
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'Proceed',
      confirmButtonColor: '#C3343A',
      showCancelButton: true,
      cancelButtonColor: '#7D7E80',
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        // console.log(this.clientInfoForm.value);
        this.addClientInfo();
        // console.log('After submit values', this.clientInfoForm.value);
      }
    });
  };

  addClientInfo = () => {
    this.proposalService
      .addClientInfo(this.clientInfoForm.value, this.proposalId)
      .subscribe({
        next: (result: any) => {
          if (result.Message === 'Client Info added Successfully!') {
            this.proposalService.AvailableNoOfSeats =
              result.AvailableNoOfSeatsInLayout;
            this.proposalService.TotalNoOfSets = result.TotalNoOfSeatsInLayout;
            this.router.navigate([ '/sales','new-proposal', 'requirement-info', this.proposalId, ]);
          }
        },
        error: (err: any) => {
          this.authService.handleAuthError(err);
        },
      });
  };


  watchValueChangesInForm = () => {

    let brokerType = this.clientInfoForm.get('brokerType');
    brokerType?.valueChanges.subscribe((res) => {
      let value = brokerType?.value;
      this.getBrokerCategoryList(res);
      this.directClient(res);
    });

  };

  watchValueChangesInBrokerCategory = () => {
    let brokerCategory = this.clientInfoForm.get('brokerCategory');

    brokerCategory?.valueChanges.subscribe((res) => {
      // console.log(res)
      let value =res;
      // console.log(value,res);

      if(value === 'other'){
        this.clientInfoForm.addControl('brokerCategoryOther', new FormControl(''));
        // console.log('categoryOther Field added');
        this.clientInfoForm.addControl('spocName',new FormControl(''));
        // console.log('spocNameFieldAdded');
        this.clientInfoForm.addControl('spocEmail',new FormControl(''));

      }
      else{
        this.clientInfoForm.removeControl('spocName');
        this.clientInfoForm.removeControl('brokerCategoryOther');
      }
    });
  }

  ngOnInit(): void {
    this.proposalId = this.getProposalId();
    // this.getAllLocation();
    // this.getCentersInLocation();
    this.watchValueChangesInForm();
    this.getLocationAndCenter();
    this.getBrokerTypeList();

    // this.getSalesHead();
  }

  getLocationAndCenter = () => {
    let location = this.locationService.selectedLocation;
    let center = this.locationService.selectedCenter;
    let address = this.locationService.selectedAddress;
    let floor = this.locationService.selectedFloor;
    let locationId = this.locationService.locationId;
    // console.log(location, center);
    this.clientInfoForm.patchValue({
      location: location,
      center: center,
      address:address,
      floor:floor,
      locationId:locationId
    });
    // console.log(this.clientInfoForm.value);
  };

  getProposalId = (): string => {
    return this.route.snapshot.params['proposalId'];
  };
}
