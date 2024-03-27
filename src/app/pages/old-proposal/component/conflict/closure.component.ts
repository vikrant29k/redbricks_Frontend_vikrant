import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/service/proposal/proposal.service';
@Component({
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: ['./closure.component.scss'],
})
export class ClosureComponent implements OnInit {
  finalOfferAmount: any;
  closerForm = new FormGroup({
    proposalId: new FormControl(''),
    clientFinalOfferAmmount: new FormControl('', Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let Id = this.route.snapshot.params['Id'];
    this.closerForm.patchValue({
      proposalId: Id,
    });
    this.getFinalAmount();
    // this.updateAmount();
  }
  getFinalAmount() {
    let Id = this.route.snapshot.params['Id'];
    this.proposalService.finalOfferAmount(Id).subscribe((res) => {
      var finalAmount: any = res;
      this.finalOfferAmount = (finalAmount.previousFinalOfferAmmount).toFixed(2);
      // console.log(this.finalOfferAmount);
    });
  }
  updateAmount() {
    let Id = this.route.snapshot.params['Id'];
    this.proposalService
      .updateOfferAmount(Id, this.closerForm.value)
      .subscribe({});
    this.router.navigate(['/sales', 'old-proposal', 'old-proposal-table']);
  }
}
