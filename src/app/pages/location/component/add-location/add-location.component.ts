import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('always' as FloatLabelType);
 

  constructor() {}

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'always';
  }
  submit(){
    console.log("submitted");
  }

  ngOnInit(): void {
    
  }
}
