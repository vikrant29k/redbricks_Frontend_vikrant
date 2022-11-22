import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  JSONFile!: File;
  layoutImage!: File;
  jsonUploaded: boolean = false;
  layoutImageUploaded: boolean = false;
  editMode: boolean = false;
  locationId!: string;
  
  
  constructor(
    private loactionService: LocationService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  locationForm = new FormGroup<any>({
    'location': new FormControl('',Validators.required),
    'center': new FormControl('', Validators.required),
    'totalNoOfWorkstation': new FormControl('', Validators.required),
    'availableNoOfWorkstation': new FormControl('', Validators.required),
    'imageLinks': new FormArray([]),
    'videoLinks': new FormArray([]),
  })

  get imageLinks() {
    return (this.locationForm.get('imageLinks') as FormArray).controls;
  }

  get videoLinks() {
    return (this.locationForm.get('videoLinks') as FormArray).controls;
  }

  jsonUploadHandler = (event: any) => {
    this.JSONFile = event.target.files[0];
    this.jsonUploaded = true;
  }

  layoutImageUploadHandler = (event: any) => {
    this.layoutImage = event.target.files[0];
    this.layoutImageUploaded = true;
  }

  onAdd(controlName: string) {
    const control = new FormControl(null,Validators.required);
    (<FormArray>this.locationForm.get(controlName)).push(control);
  }
  onRemove(controlName:string, controlIndex: number){
    (<FormArray>this.locationForm.get(controlName)).removeAt(controlIndex);
  }

  appentFormData = ():FormData => {
    let formData: FormData = new FormData;
    for (let key of Object.keys(this.locationForm.value)) {
      if (Array.isArray(this.locationForm.get(key)?.value)) {
        let temp: any =[];
        (this.locationForm.get(key)?.value).forEach((element: string, index: number) => {
          temp = [...temp, [index, element]];
        })
        temp = Object.fromEntries(temp);
        formData.append(key, JSON.stringify(temp));
      }
      else {
        formData.append(key, this.locationForm.get(key)?.value);
      }
    }
    if (this.jsonUploaded) {
      formData.append('jsonFile', this.JSONFile);
    }
    if (this.layoutImageUploaded) {
      formData.append('layoutImage', this.layoutImage);
    }

    return formData;
    
  }
  

  ngOnInit(): void {
    let ID = this.route.snapshot.params['Id'];
    if (ID) {
      this.locationId = ID;
      this.editMode = true;
      this.getLocationDataToUpdate(this.locationId);
    }
  }

  getLocationDataToUpdate = (Id: string) => {
    this.loactionService.getLocationById(Id).subscribe({
      next: (result: any) => {
        this.locationForm.patchValue({
          'location': result.location,
          'center': result.center,
          'totalNoOfWorkstation': result.totalNoOfWorkstation,
          'availableNoOfWorkstation': result.availableNoOfWorkstation
        });
        result.imageLinks.forEach((element: string, index: number) => {
          this.onAdd('imageLinks');
          this.imageLinks[index].patchValue(element);
        });
        result.videoLinks.forEach((element: string, index: number) => {
          this.onAdd('videoLinks');
          this.videoLinks[index].patchValue(element);
        })
      }
    })
  }

  onSubmit = () => {
    if (this.locationForm.invalid) {
      return;
    }
    else if (!this.jsonUploaded && !this.layoutImageUploaded && !this.editMode) {
      Swal.fire({
        title: 'File Upload Require!',
        icon: 'error',
        text: 'Both JSON and Layout Image is required. Please make sure to upload them',
        showConfirmButton: true,
        confirmButtonText: 'Got It!',
        confirmButtonColor: '#C3343A'
      })
    }
    else {
      let formData: FormData = this.appentFormData();
      if (this.editMode) {
        this.loactionService.updateLocation(this.locationId, formData).subscribe({
          next: (result: any) => {
            this.router.navigate(['/admin', 'location', 'location-list']);
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          }
        })
      }
      else {
        this.loactionService.addLocation(formData).subscribe({
          next: (result: any) => {
            this.router.navigate(['/admin', 'location', 'location-list']);
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          }
        })
      }
    }
  }
}
