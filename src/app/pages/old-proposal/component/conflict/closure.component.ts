import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: ['./closure.component.scss']
})
export class ClosureComponent implements OnInit {

  closerForm = new FormGroup({
    'proposalId': new FormControl('')
  })

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let Id = this.route.snapshot.params['Id'];
    this.closerForm.patchValue({
      proposalId: Id
    })
  }

}
