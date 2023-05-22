import { A11yModule } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-encryptdeeplink',
  templateUrl: './encryptdeeplink.component.html',
  styleUrls: ['./encryptdeeplink.component.css']
})
export class EncryptdeeplinkComponent implements OnInit {
action:any;
pagename:any;
url:any;
responseurl:any;
responsepagename:any;
responseaction:any;

  constructor(private comm: CommonService) { }

  ngOnInit() {
  }
  encriptTheurl() {
    // console.log(this.notification,"notifications")
    
        // this.spinner.show();
        let postData={
          "action" : this.action,
         "pagename" : this.pagename,
        "url" : this.url
        }
        this.comm.postData('encrypt/deeplink',postData).subscribe((response: any) => {
          //response = messageTrans;  //TEMP.
    
          this.comm.hidehttpspinner();
    
          if (response.code == "500" && response.status == "Internal Error") {
            this.comm.openDialog("warning", response.message);
            return;
          }
          else if (response.code == "200") {
    
            if (response && response.data != null) {
              this.responseurl=response.data.url
              this.responseaction=response.data.action_enc
              this.responsepagename=response.data.pagename_enc
              // this.comm.openDialog("success", response.data.message);
              
              
            }
            else {
             
              this.comm.openDialog("warning", response.message);
            }
          }
        }, (error => {
    
          this.comm.HandleHTTPError(error);
        }));
      };

}
