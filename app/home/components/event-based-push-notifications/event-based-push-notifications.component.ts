import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { OrderByObject, PageObject } from '../../../shared/models/paging';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-event-based-push-notifications',
  templateUrl: './event-based-push-notifications.component.html',
  styleUrls: ['./event-based-push-notifications.component.css']
})
export class EventBasedPushNotificationsComponent implements OnInit {
  divshowfilter: any = true;

  displayedColumns: string[] = [
    "title",
    "message",
    // "imageurl",
    // "actionurl",
    "scheduleon",
    "createdon",
    "status",
    "actions",
  ];
  public statusObj: any;
  orderByObject: OrderByObject = new OrderByObject();
  pageObject: PageObject = new PageObject();
  public notification: any = {};
  showlist: any = "1";
  dataSource: any = new MatTableDataSource();
  public searchObj: any;
  public currdate = new Date();
  public minDates = new Date();
  roleid: string = "";
  isHQ: boolean = false;
  recordId:any;
  statusValue:any
  public searchString: any = "";
  public fstatus: any = 0;
  public clusterlst: any[] = [
    { Id: "All", Name: "All" },
    { Id: "Prepaid", Name: "Prepaid" },
    { Id: "Postpaid", Name: "Postpaid" }
  ];
  public microclusterlst: any[] = [
    { Id: "All", Name: "All" },
    { Id: "Android", Name: "Android" },
    { Id: "IOS", Name: "IOS" },
  ];
  public regionlst: any[] = [
    { Id: "0", Name: "All" },
    { Id: "1", Name: "East" },
    { Id: "2", Name: "West" },
    { Id: "3", Name: "North" },
    { Id: "4", Name: "South" },

  ];
  public statuslist: any[] = [
    { id: 1, name: "Push Started", label: "success" },
    // { "id": 3, "name": "Paused", "label": "success" },
    { id: 3, name: "Stopped", label: "success" },
    { id: 10, name: "Completed", label: "success" },
    { id: 0, name: "Scheduled", label: "info" },
    { id: 4, name: "Inactive", label: "danger" },
  ];
  public pushtypelst: any[] = [
    { Id: "General", Name: "General" }
    // { Id: "Campaign", Name: "Campaign" }
  ];
  public usertypeslist: any[] = [
    { Id: "All", Name: "All" },
    { Id: "Prepaid", Name: "Prepaid" },
    { Id: "Postpaid", Name: "Postpaid" }
  ];
  private _httpobj1: Subscription;

  public circleList: any = [];
  constructor(private dialog: MatDialog, private comm: CommonService) {
    this.getlanguages();
    let _startdt = new Date();
    _startdt.setDate(new Date().getDate());
    let _enddt = new Date();
    _enddt.setDate(new Date().getDate() + 1);
    // this.currdate = new Date();
    this.searchObj = {
      pushtype: "General",
      fstatus: 0,
      searchString: "",
      userType: "All",
      fusp: "",
      zone: "0",
      circle: "All",
      subscriber_type: "All",
      Os_name: "All",
      startdate:_startdt,
      enddate: _enddt,
    };
    this.minDates.setMinutes(_startdt.getMinutes()+30)

  }
  changePageSize(obj) {
    this.pageObject.pageSize = obj.pageSize;
    this.pageObject.pageNo = 0;
    this.getNotificationlist();
  }
  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getNotificationlist();
  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = page - 1;
      this.getPage({ pageIndex: this.pageObject.pageNo });
    }
  }
  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getNotificationlist();
  }




  resetsearchtag() {
    let _startdt = new Date();
    _startdt.setDate(new Date().getDate());
    let _enddt = new Date();
    _enddt.setDate(new Date().getDate() + 1);

    this.searchObj = {
      pushtype: "General",
      fstatus: 0,
      searchString: "",
      userType: "",
      fusp: "",
      zone: "0",
      circle: "All",
      startdate: _startdt,
      enddate: _enddt,
      subscriber_type: "All",
      Os_name: "All",
    };
  }

  onPushTypeChange(id, event) {
    try {
      if (id == "General") {
        this.resetsearchtag();
        this.searchObj.pushtype = "General";
        this.notification.pushtype = "General";
      } else {
        this.resetsearchtag();
        this.searchObj.pushtype = "Campaign";
        this.notification.pushtype = "Campaign";
      }
    } catch (e) { }
  }
  getNotificationlist() {


    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    // let searchString = '';
    // if (this.searchString)
    //   searchString = this.searchString.toUpperCase();
    // let requesrParams = {
    //   search: searchString,
    //   start: start,
    //   length: this.pageObject.pageSize,
    //   orderDir: "desc",
    //   status: this.fstatus,
      
    // }
   
     let  searchString = this.searchObj.searchString.toUpperCase();
    let requesrParams = {
      search: searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc",
      // status: this.searchObj.fstatus,
    //  title:this.searchObj.title,
     startdate:formatDate(this.searchObj.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
     enddate:formatDate(this.searchObj.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
     status:this.searchObj.fstatus,
     zoneid:this.searchObj.zone,
     circleid:this.searchObj.circle,
     substype:this.searchObj.subscriber_type,
     osname:this.searchObj.Os_name,
     targetType:this.searchObj.pushtype
    }
    this.dataSource = new MatTableDataSource([]);
    // this.spinner.show();
    this.comm.postData("campaign/list", requesrParams).subscribe(
      (response: any) => {
         

        this.comm.hidehttpspinner();
        if (response.code == "500" && response.status == "error") {
          this.comm.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          if (response && response.data != null && response.data.campaignList.length>0) {
            this.dataSource = new MatTableDataSource(response.data.campaignList);
            this.pageObject.totalRecords = response.data.recordsFiltered;
            this.pageObject.totalPages = response.data.recordsFiltered;
            this.dataSource.sort = this.sort;
            for(let j=0;j<response.data.campaignList.length;j++){
              response.data.campaignList[j].btndis=false
            }
            for(let i=0;i<response.data.campaignList.length;i++){
              
              let newdate=moment(response.data.campaignList[i].startdate)
              var currentMin = moment.utc();
              let minutes = currentMin.diff(newdate, 'minutes');
              
              if(minutes>=15){
                response.data.campaignList[i].btndis=true
              }
            }
            
        
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.comm.openSnackBar("No Records Found");
          }
        }
      },
      (error) => {
        this.comm.HandleHTTPError(error);
      }
    );
  }
  onAreaChangeEdit(value, event: any){
    this.notification.zoneid=value;

  }
  oncircleChangeEdit(value,$event){
   
this.notification.circleid=value
  }
  onClusterChangeEdit(value, event: any){
   this.notification.subscriber_type=value
  }
  onOsnameChange(value,$event){
this.notification.Os_name=value
  }
  onAreaChange(value, event: any) {
    this.searchObj.zone=value
    // if (event.isUserInput) {
    //   // this.searchObj.zone = value;
    //   // this.searchObj.circle = 0;
    //   // this.searchObj.cluster = 0;
    //   // this.searchObj.microcluster = 0;
    //   // this.salesarealst = this.imiapi.getLocationsData(
    //   //   "salesarea",
    //   //   this.searchObj.region
    //   // );
    //   // this.clusterlst = [];
    //   // this.microclusterlst = [];
    // }
  }
  onClusterChange(value,$event){
    this.notification.subscriber_type=value;
  }
  oncircleChange(value, event: any){
this.searchObj.circle=value;
  }
  onStatusChange(value, event: any) {
    this.searchObj.fstatus = value;
  }
  onStatusChanged(value){
    this.statusValue=value

  }
  onClusterChanges(value, event: any) {
    this.searchObj.subscriber_type=value
    // if (event.isUserInput) {
    //   // this.searchObj.cluster = value;
    //   // this.searchObj.microcluster = 0;
    //   // this.microclusterlst = this.imiapi.getLocationsData(
    //   //   "microcluster",
    //   //   this.searchObj.cluster
    //   // );
    // }
  }
  onosnameChanges(value, event: any){
this.searchObj.Os_name=value
  }

  ngOnInit() {
   
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getNotificationlist();
    this.resetsearchtag()

  }
  getNotificationlistfoesearch() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getNotificationlist();
  }
  getlanguages() {

    this._httpobj1 = this.comm.postData('template/json ', { "type": "circles" }).subscribe((response: any) => {
      if (response.code == "500") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.status == "success") {

          let newlist = JSON.parse(response.data)

          this.circleList = newlist.data.circles;
          // console.log(this.circleList, "this.circleList")
          //  let newfieldvalue=this.languageList.filter(x=>x.id=="hi")
          //  this.multilagnuages=newfieldvalue[0].id
        }
        else {


          this.comm.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.comm.HandleHTTPError(error);
    });
  };
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  AddNewNotification() {
    this.resetnotificationobject();
    this.showlist = "2";
  }
  Addchangestatus(value) {
    console.log(value)
   this.recordId=value.id
   
  }
  editnotification(recoed: any) {
// console.log(recoed,"record", typeof(recoed.circleid),recoed.circleid)
if(recoed.startdate!=""){
  let str = recoed.startdate.substring(0, recoed.startdate.length - 2);
  let sdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
  this.notification.startdate= sdate;
}
if(recoed.enddate!=""){
  let str = recoed.enddate.substring(0, recoed.enddate.length - 2);
  let edate: Date = new Date(str.replace("-", "/").replace("-", "/"));
  this.notification.enddate= edate;
}
// if(recoed.scheduledate!=""){
//   let str = recoed.scheduledate.substring(0, recoed.scheduledate.length - 2);
//   let ssdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
//   this.notification.scheduleon= ssdate;
// }
    // this.notification={...recoed}
    this.notification.pushcode = recoed.message
    this.notification.id = recoed.id;
    // pushcode: recoed,
    this.notification.title = recoed.title,
      this.notification.message = recoed.message;
    this.notification.image = recoed.imageurl;
    this.notification.actionurl = recoed.actionurl;
    // this.notification.scheduleon = recoed.scheduledate;
    this.notification.pushtype = recoed.targettype,
      this.notification.zoneid = recoed.zoneid;
    this.notification.circleid = recoed.circleid;
    // usertype: recoed,
    // mobileno:recoed,
    this.notification.status = recoed.status;
    // createddate: recoed,
    // updateddate: recoed,
    // createdby: recoed,
    this.notification.triggeron = recoed.targettype;
    this.notification.completedon = recoed.createdon;
    // this.notification.notifysendnow= recoed.targettype;
    this.notification.subscriber_type = recoed.substype;
    this.notification.Os_name = recoed.osname;
    // this.notification.startdate = recoed.startdate;
    // this.notification.enddate = recoed.enddate;


    this.showlist = "2";
// console.log(this.notification,"notifications")
  }

  resetnotificationobject() {
    let _startdt = new Date();
    _startdt.setMinutes(_startdt.getMinutes()+30)

    // _startdt.setDate(new Date().getDate());
  //  _startdt=new_startdt.getMinutes()+30)
    let _enddt = new Date();
    _enddt.setDate(new Date().getDate() + 7);
    this.notification = {
      id: "",
      pushcode: "",
      title: "",
      message: "",
      image: "",
      actionurl: "",
      // scheduleon: new Date(),
      pushtype: "General",
      zoneid: "0",
      circleid: "All",
      usertype: "All",
      mobileno: "",
      status: 1,
      createddate: "",
      updateddate: "",
      createdby: "",
      triggeron: "",
      completedon: "",
      notifysendnow: "now",
      subscriber_type: "All",
      Os_name: "All",
      startdate: _startdt,
      enddate: _enddt,

    };
  }
  ResetAddView() {
    this.showlist = "1";
  }
  InsertNotifications() {

    if (this.notification.title == "" || this.notification.title == undefined) {
      this.comm.openDialog("warning", "Title is  required");
      return;

    }
    if (this.notification.image == "" || this.notification.image == undefined) {
      this.comm.openDialog("warning", "Image url is  required");
      return;

    }
    if (this.notification.actionurl == "" || this.notification.actionurl == undefined) {
      this.comm.openDialog("warning", "action url is  required");
      return;

    }
    if (this.notification.message == "" || this.notification.message == undefined) {
      this.comm.openDialog("warning", "message is  required");
      return;

    }
    // let newdate=moment(this.notification.startdate)
    // var currentMin = moment.utc();
    // let minutes = newdate.diff(currentMin, 'minutes');
    
    // if(minutes<=30){
    //   this.comm.openDialog("warning", "time gap minimum 30 minutes");
    //   return;

    // }
    let requesrParams = {
      "title": this.notification.title,
      "imageurl": this.notification.image,
      "actionurl": this.notification.actionurl,
      "message": this.notification.message,
      // "scheduledate": formatDate(this.notification.scheduleon, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "targettype": this.notification.pushtype,
      "zoneid": this.notification.zoneid,
      "circleid": this.notification.circleid,
      "substype": this.notification.subscriber_type,
      "startdate": formatDate(this.notification.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "enddate": formatDate(this.notification.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "osname": this.notification.Os_name,

    }
    // this.spinner.show();
    this.comm.postData('campaign/savecampagin', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP.

      this.comm.hidehttpspinner();

      if (response.code == "500" && response.status == "Internal Error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {

        if (response && response.data != null) {
          // this.dataSource = new MatTableDataSource(response.data);
          // this.pageObject.totalRecords = response.recordsTotal;
          // this.pageObject.totalPages = response.recordsFiltered;
          // this.dataSource.sort = this.sort;
          this.comm.openDialog("success", response.data.message);
          this.ResetAddView();
          this.getNotificationlist();
        }
        else {
          // this.dataSource = new MatTableDataSource([]);
          // this.pageObject.totalRecords = 0;
          // this.pageObject.totalPages = 0;
          this.comm.openSnackBar("No Records Found");

        }
      }
    }, (error => {

      this.comm.HandleHTTPError(error);
    }));
  };
  UpdateNotification() {
// console.log(this.notification,"notifications")

    let requesrParams = {
      "title": this.notification.title,
      "imageurl": this.notification.image,
      "actionurl": this.notification.actionurl,
      "message": this.notification.message,
      // "scheduledate": formatDate(this.notification.scheduleon, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "targettype": this.notification.pushtype,
      "zoneid": this.notification.zoneid,
      "circleid": this.notification.circleid,
      "substype": this.notification.subscriber_type,
      "startdate": formatDate(this.notification.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "enddate": formatDate(this.notification.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "osname": this.notification.Os_name,
      "id": this.notification.id

    }
    // this.spinner.show();
    this.comm.postData('campaign/savecampagin', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP.

      this.comm.hidehttpspinner();

      if (response.code == "500" && response.status == "Internal Error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {

        if (response && response.data != null) {
          // this.dataSource = new MatTableDataSource(response.data);
          // this.pageObject.totalRecords = response.recordsTotal;
          // this.pageObject.totalPages = response.recordsFiltered;
          // this.dataSource.sort = this.sort;
          this.comm.openDialog("success", response.data.message);
          this.ResetAddView();
          this.getNotificationlist();
        }
        else {
          // this.dataSource = new MatTableDataSource([]);
          // this.pageObject.totalRecords = 0;
          // this.pageObject.totalPages = 0;
          this.comm.openSnackBar("No Records Found");

        }
      }
    }, (error => {

      this.comm.HandleHTTPError(error);
    }));
  };
  getstatustext(id) {
    
    if (id == "1") {
      return "Push Started";
    }
   if(id == "3"){
    return "Stopped";
   }
   if (id == "10") {
    return "Completed";
  }
 if(id == "0"){
  return "Scheduled";
 }
if(id == "4"){
return "Inactive";
}
   
  }
  ChangetheNotificationstatus() {
    // console.log(this.notification,"notifications")
    
        // this.spinner.show();
        this.comm.postData('campaign/changecampaignstatus',{"status":"3","id":this.recordId}).subscribe((response: any) => {
          //response = messageTrans;  //TEMP.
    
          // this.comm.hidehttpspinner();
    
          if (response.code == "500" && response.status == "Internal Error") {
            this.comm.openDialog("warning", response.message);
            return;
          }
          else if (response.code == "200") {
    
            if (response && response.data != null) {
              this.comm.openDialog("success", response.message);
              this.getNotificationlist();
              
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
