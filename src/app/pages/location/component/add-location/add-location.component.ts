import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from "@angular/forms";


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  
  
  constructor() {}
  
  locationForm = new FormGroup({
    'location': new FormControl(''),
    'center': new FormControl(''),
    'imageLinks': new FormArray([]),
    'videoLinks': new FormArray([]),
  })

  get imageLinks() {
    return (this.locationForm.get('imageLinks') as FormArray).controls;
  }

  get videoLinks() {
    return (this.locationForm.get('videoLinks') as FormArray).controls;
  }

  onAdd(controlName: string) {
    const control = new FormControl(null);
    (<FormArray>this.locationForm.get(controlName)).push(control);
  }
  onRemove(controlName:string, controlIndex: number){
    (<FormArray>this.locationForm.get(controlName)).removeAt(controlIndex);
  }
  

  ngOnInit(): void {
    
  }

  onSubmit = () => {
    console.log(this.locationForm.value)

  }
}
