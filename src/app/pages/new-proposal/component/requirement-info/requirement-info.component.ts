import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import Swal from 'sweetalert2';
import { LocationService } from 'src/app/service/location/location.service';

@Component({
  selector: 'new-proposal-requirement-info',
  templateUrl: './requirement-info.component.html',
  styleUrls: ['./requirement-info.component.scss'],
})
export class NewProposalRequirementInfoComponent implements OnInit {
  active:boolean=false;
  activate(){
    this.active=!this.active;
  }
  proposalId: string = 'lasdfoawefalsdfalskdf';

  totalWorkStationBalance: any = 373;
  totalWorkstationBooked: any = 0;
  totalAvailableWorkstation: any;
  totalSelectedWorkstation: number = 0;
  billableSeats!:number
  areaOfCoreSelectedSeat:any;
  areaOfUsableSelectedSeat:any;

  valueToBeDivided:any;
  valueOfDinominator:any=1152;
id:any;
  requirementInfoForm:any = new FormGroup({
    areaOfCoreSelectedSeat:new FormControl(),
    areaOfUsableSelectedSeat:new FormControl(),
    createWithArea:new FormControl('count',Validators.required),
    workstation2x1: new FormControl(),
    workstation3x2: new FormControl(),
    workstation4x2: new FormControl(),
    workstation5x2: new FormControl(),
    workstation5x2_5: new FormControl(),
    workstation4x4: new FormControl(),
    workstation5x4: new FormControl(),
    workstation5x5: new FormControl(),
    cubicalCount: new FormControl(),
    cabinRegular: new FormControl(),
    cabinMedium: new FormControl(),
    cabinLarge: new FormControl(),
    cabinMD: new FormControl(),
    meeting4P: new FormControl(),
    meeting6P: new FormControl(),
    meeting8P: new FormControl(),
    meeting10P: new FormControl(),
    meeting12P: new FormControl(),
    meeting16P: new FormControl(),
    board20P: new FormControl(),
    board24P: new FormControl(),
    collab4P: new FormControl(),
    collab6P: new FormControl(),
    collab8P: new FormControl(),
    dryPantryNumber: new FormControl(),
    receptionSmall: new FormControl(),
    receptionMedium: new FormControl(),
    receptionLarge: new FormControl(),
    storeRoomNumber: new FormControl(),
    phoneBoothNumber: new FormControl(),
    nicheSeat2Pax: new FormControl(),
    nicheSeat4Pax: new FormControl(),
    cafeteriaNumber: new FormControl(),
    server1Rack: new FormControl(),
    server2Rack: new FormControl(),
    server3Rack: new FormControl(),
    server4Rack: new FormControl(),
    prayerRoomNumber: new FormControl(),
    wellnessRoomNumber: new FormControl(),
    trainingRoomNumber: new FormControl(),
    gameRoomNumber: new FormControl(),
    content:new FormControl(),
    totalNumberOfSeats: new FormControl(),
    billableSeats:new FormControl()

  });


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private authService: AuthenticationService,
    private locationService:LocationService
  ) {}

  ngOnInit(): void {

    (window as any).scrollTo(top);

    this.totalWorkStationBalance = this.proposalService.AvailableNoOfSeats;
    console.log(this.totalWorkStationBalance)
     this.totalAvailableWorkstation = this.locationService.totalWorkstation - this.locationService.selectedSeats;
     console.log(this.totalAvailableWorkstation)
// const numberOfseats =localStorage.getItem('selectedSeat');
// this.totalAvailableWorkstation=this.proposalService.AvailableNoOfSeats - Number(numberOfseats) ;

    this.proposalId = this.getProposaId();
    this.proposalService.getProposalById(this.proposalId).subscribe((res:any)=>{
       console.log(res)

      this.requirementInfoForm.patchValue(res[0]);
      console.log( this.requirementInfoForm.value,"gt the data")
    })
    this.watchFormValue();
  }

  onSubmit = () => {
    // console.log(this.requirementInfoForm.get('createWithArea'))
    let finalSeat = Math.ceil(this.billableSeats);
    let totalSeat = Math.ceil(this.totalSelectedWorkstation)
    this.requirementInfoForm.patchValue({
      billableSeats:finalSeat,
      totalNumberOfSeats:totalSeat
    });
    let contentt =  document.getElementById('datadiv')?.textContent;
    this.requirementInfoForm.patchValue({
      content:contentt
    });
    this.requirementInfoForm.patchValue({
      areaOfCoreSelectedSeat:this.areaOfCoreSelectedSeat,
      areaOfUsableSelectedSeat:this.areaOfUsableSelectedSeat,
    });

    this.proposalService.addRequirement(this.requirementInfoForm.value, this.proposalId).subscribe({
        next: (result: any) => {
          if (result.Message === 'Requirement added Successfully!') {
            this.proposalService.consolidatedSeats = result.consolidatedSeats;
            this.proposalService.seatAvailability = result.seatsAvailability;
            this.proposalService.conflict = result.conflict;

            // console.log(this.proposalService.conflict);
            // this.router.navigate(['/sales','new-proposal','space-availability',this.proposalId]);
          }
          if (this.proposalService.conflict === true) {
            Swal.fire({
              title: 'Conflict Found',
              text: 'Is it the same client or another client',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'Another Client',
              confirmButtonColor: '#C3343A',
              showCancelButton: true,
              cancelButtonText: 'Same Client',
              cancelButtonColor: '#7D7E80',
            }).then((confirmation) => {
              if (confirmation.isConfirmed) {
                this.router.navigate(['/sales', 'new-proposal','space-availability', this.proposalId,]);
              } else {
                this.router.navigate(['/']);
              }
            });
          } else {
            this.router.navigate(['/sales','new-proposal', 'space-availability',this.proposalId, ]);
          }
        },
        error: (err: any) => {
          this.authService.handleAuthError(err);
        },
      });
  };


  getProposaId = () => {
    return this.route.snapshot.params['proposalId'];
  };

totalWorkstation(){

}


  watchFormValue = () => {
    this.requirementInfoForm.valueChanges.subscribe(() => {
      let value = this.requirementInfoForm.value;

      this.totalSelectedWorkstation =
  //  (value.workstation2x1 * 0.60) +
    (value.workstation3x2 * 0.75) +
    (value.workstation4x2 * 1.00) +
    (value.workstation5x2 * 1.25) +
    // (value.workstation5x2_5 * 1.50) +
    // (value.workstation4x4 * 1.25) +
    (value.workstation5x4 * 1.50) +
    (value.workstation5x5 * 1.75) +
    (value.cubicalCount * 3.75) +
    (value.cabinRegular * 4.50) +
    (value.cabinMedium * 5.00) +
    (value.cabinLarge * 6.50) +
    (value.cabinMD * 7.50) +
    (value.meeting6P * 6.50)+
    (value.meeting8P * 12.00) +
    (value.meeting10P * 14.00) +
    (value.meeting4P * 4.50) +
    (value.meeting16P * 25.00) +
    (value.meeting12P * 17.00) +
    (value.board20P * 30.00) +
    (value.board24P * 34.00) +
    (value.collab4P * 4.75) +
    (value.collab6P * 6.50) +
    (value.collab8P * 9.25) +
    (value.dryPantryNumber * 4.50) +
    (value.receptionSmall * 5.00) +
    (value.receptionMedium * 6.50)  +
    (value.receptionLarge * 7.50) +
    (value.storeRoomNumber * 4.50) +
    (value.phoneBoothNumber * 1.25) +
    (value.nicheSeat2Pax * 1.25) +
    (value.nicheSeat4Pax * 1.75) +
    (value.cafeteriaNumber * 1.2) +
    (value.server1Rack * 4.50) +
    (value.server2Rack * 7.00) +
    (value.server3Rack * 9.00) +
    (value.server4Rack * 10.50) +
    (value.prayerRoomNumber * 4.50) +
    (value.wellnessRoomNumber * 4.50)  +
    value.trainingRoomNumber +
    value.gameRoomNumber;
    this.billableSeats  = Number((this.totalSelectedWorkstation + (this.totalSelectedWorkstation*0.1)).toFixed(2));
    this.areaOfCoreSelectedSeat = (this.billableSeats*19.00).toFixed(2);
    this.areaOfUsableSelectedSeat = (this.areaOfCoreSelectedSeat *1.85).toFixed(2);

    // let circulation = totalNoOfSeats*0.1;
    // let netBillableSeat = totalNoOfSeats + circulation;
    });
  };

}
