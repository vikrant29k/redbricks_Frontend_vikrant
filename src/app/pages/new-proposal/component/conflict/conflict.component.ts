import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
@Component({
  selector: 'app-conflict',
  templateUrl: './conflict.component.html',
  styleUrls: ['./conflict.component.scss'],
})
export class ConflictComponent implements OnInit {
  conflict: boolean = false;
  proposalId!: string;

  otp = new FormControl('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.conflict = this.proposalService.conflict;
    this.proposalId = this.route.snapshot.params['proposalId'];
  }

  // sendOtp = (mobileNo: string = '+919834870884') => {
  //   this.proposalService.sendOtp(mobileNo, this.proposalId).subscribe();
  // }

  // verifyOtp = () => {
  //   this.proposalService.verifyOtp(this.otp.value, this.proposalId).subscribe((result: any) => {
  //     if (result.Message === "OTP verified Successfully") {
  //       this.registerBroker();
  //     }
  //   })
  // }

  registerBroker = () => {
    this.router.navigate([
      '/sales',
      'new-proposal',
      'space-availability',
      this.proposalId,
    ]);
  };
}
