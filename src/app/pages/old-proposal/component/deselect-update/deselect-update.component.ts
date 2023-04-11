import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-deselect-update',
  templateUrl: './deselect-update.component.html',
  styleUrls: ['./deselect-update.component.scss']
})
export class DeselectUpdateComponent implements OnInit {
  selectFrom: 'left' | 'right' = 'left';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
