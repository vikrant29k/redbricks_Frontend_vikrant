import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-conflict',
  templateUrl: './conflict.component.html',
  styleUrls: ['./conflict.component.scss']
})
export class ConflictComponent implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit(): void {
  }
  onSubmit = () => {
    this.router.navigate(['/new-proposal', 'space-availability']);
}
}
