import { Component, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../shared/services/common.service';
declare var $: any;
@Component({
  selector: 'app-msgdialoguebox',
  templateUrl: './msgdialoguebox.component.html',
  styleUrls: ['./msgdialoguebox.component.css']
})
export class MsgdialogueboxComponent {
  msgobj:any;
  
  constructor(public bsModalRef: BsModalRef,private imiapiservice:CommonService) {
    this.msgobj=Message
  }
  ngOnInit() { 
    this.msgobj.ishtml = this.msgobj.ishtml ? this.msgobj.ishtml : false;
  }

  closeAllModals(){
    this.imiapiservice.closeAllModals();
  };

}
export class Message {
  public type:string = "";
  public message: string = "";
  public ishtml = false;
}
