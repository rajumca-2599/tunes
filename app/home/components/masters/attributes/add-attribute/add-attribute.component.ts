import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.css']
})
export class AddAttributeComponent implements OnInit {
  public title: string = "ADD COMMERCIAL ATTRIBUTE";
  public attriobj: any;
  public subcribertypes: any[] = [];
  mode: string = "insert";
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddAttributeComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.attriobj = {
      id: 0,
      key: "",
      value: "",
      desc: "",
      group:"",
      mode: "insert"
    };
    if (data.mode == "update") {
      this.mode = "update";
      this.title = "EDIT COMMERCIAL ATTRIBUTE"
      this.attriobj.key = data.key;
      this.attriobj.value = data.value;
      this.attriobj.desc = data.desc;
      this.attriobj.group = data.group;
      this.attriobj.mode = "update";
    }
    
  }

  ngOnInit() {
   
  }
  close() {
    this.dialogRef.close();
  }
  submitAttribute() {
    let req = {
      "key": this.attriobj.key,
      "value": this.attriobj.value,
      "desc": this.attriobj.desc,
      "group": this.attriobj.group,
      "createdBy": this.comm.getUserId(),
      "modifiedBy": this.comm.getUserId()
    };
    let url = "attributes/createattributes";
    if (this.attriobj.mode == "update")
      url = "attributes/updateattributes";

    this.comm.postData(url, req).subscribe((resp: any) => {
      if (this.attriobj.mode == "insert")
        this.comm.openDialog('success', 'Attribute has been successfully created.');
      else
        this.comm.openDialog('success', 'Attribute has been Updated Successfully.');
      this.dialogRef.close();
    }, (err => {
      console.log(err);
    }));
  }
}
