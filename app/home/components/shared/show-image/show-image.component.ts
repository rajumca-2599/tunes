import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.css']
})
export class ShowImageComponent implements OnInit {
  public imageurl: string = "";
  constructor(private dialogRef: MatDialogRef<ShowImageComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.imageurl = data;
  }
  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}
