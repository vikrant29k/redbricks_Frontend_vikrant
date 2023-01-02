import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'new-proposal-requirement-info',
  templateUrl: './requirement-info.component.html',
  styleUrls: ['./requirement-info.component.scss'],
})
export class NewProposalRequirementInfoComponent implements OnInit {
  proposalId: string = 'lasdfoawefalsdfalskdf';
  totalWorkStationBalance: any = 373;
  totalWorkstationBooked: any = 0;
  totalAvailableWorkstation: any = 373;
  totalSelectedWorkstation: any = 0;

  requirementInfoForm = new FormGroup({
    workstationSize: new FormControl('small'),
    workstationNumber: new FormControl(''),
    cabinSize: new FormControl('small'),
    cabinNumber: new FormControl(''),
    meetingRoomSize: new FormControl('small'),
    meetingRoomNumber: new FormControl(''),
    visitorMeetingRoomSize: new FormControl('small'),
    visitorMeetingRoomNumber: new FormControl(''),
    collabArea: new FormControl('no'),
    dryPantry: new FormControl('no'),
    storeRoom: new FormControl('no'),
    storeRoomNumber: new FormControl(''),
    cafeteria: new FormControl('no'),
    cafeteriaNumber: new FormControl(''),
    reception: new FormControl('no'),
    mailRoom: new FormControl('no'),
    bmsRoom: new FormControl('no'),
    compactor: new FormControl('no'),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    (window as any).scrollTo(top);
    this.totalWorkStationBalance = this.proposalService.TotalNoOfSets;
    this.totalAvailableWorkstation = this.proposalService.AvailableNoOfSeats;
    this.proposalId = this.getProposaId();
    this.watchFormValue();
  }

  onSubmit = () => {
    this.proposalService
      .addRequirement(this.requirementInfoForm.value, this.proposalId)
      .subscribe({
        next: (result: any) => {
          if (result.Message === 'Requirement added Successfully!') {
            this.proposalService.consolidatedSeats = result.consolidatedSeats;
            this.proposalService.seatAvailability = result.seatsAvailability;
            this.proposalService.conflict = result.conflict;
            console.log(this.proposalService.conflict, 'fasfasf');
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

  // ifConflict(){

  // }

  getProposaId = () => {
    return this.route.snapshot.params['proposalId'];
  };

  watchFormValue = () => {
    this.requirementInfoForm.valueChanges.subscribe(() => {
      let value = this.requirementInfoForm.value;
      this.totalSelectedWorkstation =
        Number(value.workstationNumber) +
        Number(value.cabinNumber) +
        Number(value.meetingRoomNumber) +
        Number(value.visitorMeetingRoomNumber);
    });
  };

  selectOnlyOneCheckBox = (control: string, value: string) => {
    this.requirementInfoForm.get(control)?.setValue(value);
    console.log(this.requirementInfoForm.get(control)?.value);
  };
}
