import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/service/users/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';
import { GenerateRackValueComponent } from '../generate-rack-value/generate-rack-value.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
  providers:[ {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
]
})
export class AddLocationComponent implements OnInit {
  date = new FormControl(moment());
  myFiles:any [] = [];
  myFileImageLink:any[]=[]
  layoutImage!: File;
  jsonUploaded: boolean = false;
  layoutImageUploaded: boolean = false;
  editMode: boolean = false;
  locationId!: string;
  userDataBeforeEdit: any;
  salesHeads: any = [];
  toDate:any;
  rentCamArray:any;
  selectMultipleImages: any = false;
  baseUrl:string = environment.baseUrl+'images/'
  constructor(
    private dialog:MatDialog,
    private datepipe: DatePipe,
    private loactionService: LocationService,
    private authService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  locationForm = new FormGroup<any>({
    location: new FormControl('', Validators.required),
    salesHead: new FormControl('', Validators.required),
    center: new FormControl('', Validators.required),
    floor:new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    selectedNoOfSeats:new FormControl(''),
    totalNoOfWorkstation: new FormControl('', Validators.required),
    rentSheet: new FormArray([]),
    carParkCharge: new FormControl(''),
  });


  selectSalesHead() {
    this.userService.getSalesHead().subscribe({
      next: (result: any) => {
        this.salesHeads = [...result];
        this.locationForm.addControl('salesHead', new FormControl(''));
        if (this.editMode) {
          this.locationForm.get('salesHead')?.patchValue(this.userDataBeforeEdit.salesHead);
          this.cd.detectChanges();
        }
      },
    });
  }

  get rentSheet() {
    return (this.locationForm.get('rentSheet') as FormArray).controls;
  }

  layoutImageUploadHandler = (event: any) => {
    this.layoutImage = event.target.files[0];
    this.layoutImageUploaded = true;
  };

  onAdd(controlName: string) {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.locationForm.get(controlName)).push(control);
  }
  transformToFormGroup(control:any){
    return control as FormGroup;
  }
  onAddFromGroup() {
    const control = new FormGroup({
      year: new FormControl('', Validators.required),
      rent: new FormControl('', Validators.required),
      cam: new FormControl('', Validators.required)
    });
    (<FormArray>this.locationForm.get('rentSheet')).push(control);
  }
  onRemove(controlName: string, controlIndex: number) {
    (<FormArray>this.locationForm.get(controlName)).removeAt(controlIndex);
  }

  appentFormData = (): FormData => {
    let formData: FormData = new FormData();
    for (let key of Object.keys(this.locationForm.value)) {
      if (Array.isArray(this.locationForm.get(key)?.value)) {
        let temp: any = [];
        this.locationForm.get(key)?.value.forEach((element: string, index: number) => {
            temp = [...temp, [index, element]];
          });
        temp = Object.fromEntries(temp);
        formData.append(key, JSON.stringify(temp));
      } else {
        formData.append(key, this.locationForm.get(key)?.value);
      }
    }

    if (this.layoutImageUploaded) {
      formData.append('layoutImage', this.layoutImage);
    }
    if(this.selectMultipleImages && this.myFiles.length>0){
      for  (var i =  0; i <  this.myFiles.length; i++)  {
        formData.append("centerImage",  this.myFiles[i]);
    }

    }

    return formData;
  };

  ngOnInit(): void {

    this.toDate = this.datepipe.transform(new Date(),'yyyy')
    let ID = this.route.snapshot.params['Id'];
    if (ID) {
      this.locationId = ID;
      this.editMode = true;
      this.getLocationDataToUpdate(this.locationId);
    }
    if(this.editMode==true){
      this.onAddFromGroup()
    }
    this.selectSalesHead();
  }

allData:any
  getLocationDataToUpdate = (Id: string) => {

    this.loactionService.getLocationById(Id).subscribe({
      next: (result: any) => {
        this.allData=result;
        this.rentCamArray=result.rentSheet;

        console.log("asdfsadsdaa",result);
        this.locationForm.patchValue({
          location: result.location,
          selectedNoOfSeats:result.selectedNoOfSeats||0,
          center: result.center,
          floor:result.floor,
          totalNoOfWorkstation: result.totalNoOfWorkstation,
          salesHead: result.salesHead,
          address: result.address,
          perSeatPrice: result.perSeatPrice,
          rentSheet: result.rentSheet,
          carParkCharge: result.carParkCharge,
          rackRate: result.rackRate,
        });
        result.rentSheet.forEach((element: any,index: number) => {
          this.onAddFromGroup();
          this.rentSheet[index].patchValue(element);
        })

      },
    });

  };

  onSubmit = () => {

    // console.log(this.locationForm.value,"on add location submit");
    if (this.locationForm.invalid)
    {
      return;
    } else if (!this.layoutImageUploaded && !this.editMode)
    {
      Swal.fire({
        title: 'File Upload Require!',
        icon: 'error',
        text: 'Both JSON and Layout Image is required. Please make sure to upload them',
        showConfirmButton: true,
        confirmButtonText: 'Got It!',
        confirmButtonColor: '#C3343A',
      });
    }
    else
    {
    let val =  this.locationForm.get('rentSheet')?.value;
    // console.log(val,"asdasd");
    let total = val[0].rent + val[0].cam
     this.locationForm.patchValue({
       rentAndCamTotal:total
     });
      let formData: FormData = this.appentFormData();
      if (this.editMode)
      {

        // console.log(this.locationForm.value.rentAndCamTotal)
        this.loactionService.updateLocation(this.locationId, formData).subscribe({
            next: (result: any) => {
              // this.router.navigate(['/admin', 'location', 'location-list']);
            const dialogRef = this.dialog.open(GenerateRackValueComponent, {
              width: '1010px',
              height: '650px',
              data: { rentCamTotal: total, locationData:result.data, locationId:this.locationId, formdata:this.allData,editMode:this.editMode},
            });
            dialogRef.afterClosed().subscribe(()=>{
              this.router.navigate(['/admin', 'location', 'location-list']);
            })
            },
            error: (err: any) => {
              this.authService.handleAuthError(err);
            },
          });
      }
      else
      {

        //  console.log(this.locationForm.value.rentAndCamTotal)

        this.loactionService.addLocation(formData).subscribe({
          next: (result: any) => {
            // console.log(result,"Add locataionasddddddddddddddddddddd")
            const dialogRef = this.dialog.open(GenerateRackValueComponent, {
              width: '1010px',
              height: '650px',
              data: { rentCamTotal: total, locationData:result.data, editMode:this.editMode},
            });
            dialogRef.afterClosed().subscribe(()=>{
              this.router.navigate(['/admin', 'location', 'location-list']);
            })

            // this.router.navigate(['/admin', 'location', 'location-list']);
          },
          error: (err: any) => {
            this.authService.handleAuthError(err);
          },
        });
      }
    }
  };
  chosenYearHandler(normalizedYear: any, dp: any,index:any) {
    const ctrlValue:any = this.date.value ;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  console.log(this.locationForm)
  this.rentSheet[index].patchValue({year:ctrlValue});
    dp.close()
  }
  // add new method select image
  getFileDetails (e:any) {
    //console.log (e.target.files);
    let reader = new FileReader();
    this.selectMultipleImages =true
    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      if (e.target.files && e.target.files[i]) {
        reader.readAsDataURL(file);

        // When file uploads set it to file formcontrol
        reader.onload = () => {
          let imgeUrl
          imgeUrl = reader.result;
          this.myFileImageLink.push(imgeUrl)
          // this.editFile = false;
          // this.removeUpload = true;
        }
        // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();
      }
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles)
  }
  deleteImageFromList = (index:number) =>{
      this.myFiles.splice(index,1)
  }
  deleteSelectedImage = (path:string,index:number,istrue?:any) =>{
    if(istrue){
      this.myFileImageLink.splice(index,1);
      this.myFiles.splice(index,1)
    }else{

      const data={
        imgPath:path
      }
      this.loactionService.deleteSelectedImage(data,this.locationId).pipe(take(1)).subscribe((res:any)=>{
        console.log(res)
        this.allData.centerImage.splice(index,1)
      })
    }
  }
}
