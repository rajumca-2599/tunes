import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../../../../src/app/shared/services/common.service";

@Component({
  selector: "app-view-data",
  templateUrl: "./view-data.component.html",
  styleUrls: ["./view-data.component.css"],
})
export class ViewDataComponent implements OnInit {
  options: any;
  title="";
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<ViewDataComponent>,
    private activeRoute: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.options = data.options;
this.title="View Data"
  }

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }
}
