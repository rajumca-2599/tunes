import { formatDate } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;
import * as moment from 'moment';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  @ViewChild('fileInput') InputFrameVariable: ElementRef;
  public userinfo: any;
  public edituserinfo: any;
  public msg: string = '';
  public minDate: Date;
  public maxDate: Date;
  selectedlanguage = 'ID';
  imageUrl: string | ArrayBuffer = '';
  bsConfig: Partial<BsDatepickerConfig>;
  helpurl = '';
  userimage = '';
  userProfile: any = {};
  accountype: string = '';
  msisdn = '';
  days: number;
  txtUserName = '';
  txtDob = '';
  txtReferalCode = '';
  txtEmailId = '';
  usernameerror = '';
  redemMsg = '';
  emailmsg = '';
  profilepicturemessage = '';
  accepttype = 'image/png,image/gif,image/jpeg';
  public uploader: FileUploader = new FileUploader({
    url: this.imiapi.getUrl('v1/profile/pwa/uploadphoto',"dummyvalue"),
  });

  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    public env: EnvService,
    public translate: TranslateService,
    private apidata: ApidataService,
    private cd: ChangeDetectorRef
  ) {
    this.edituserinfo = {
      name: '',
      email: '',
      dob: '',
      referralcode: '',
    };
    this.msg = '';

    let min = new Date();
    let max = new Date();
    let minYr = env.dob_min_year; // min.getFullYear() - env.dob_min_year;
    min.setFullYear(minYr);
    min.setMonth(0);
    min.setDate(-1);

    let maxYr = max.getFullYear() - env.dob_max_year;
    max.setFullYear(maxYr);
    max.setMonth(max.getMonth());
    max.setDate(max.getDate() - 1);

    this.minDate = min;
    this.maxDate = max;
    console.log(this.maxDate);
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        showWeekNumbers: false,
      }
    );
  }
  // getCustomerImage() {
  //   this.userimage = this.env.cdnurl + 'assets/images/img-prifile.jpg';
  //   this.userProfile = this.imiapi.getUserProfile();
  //   if (
  //     !(
  //       this.userProfile == null ||
  //       this.userProfile == 'undefined' ||
  //       this.userProfile == 'NA'
  //     )
  //   )
  //     this.userimage = this.userProfile.imagelocation;
  // }

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.msisdn = this.imiapi.getMSISDN();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.accountype = this.imiapi.getSubstype().toUpperCase();
    //this.getCustomerImage();
    this.getProfileImage();
    this.getCustomerProfile();
    if (
      this.imiapi.getSession('childno') != undefined &&
      this.imiapi.getSession('childno') != 'NA' &&
      this.imiapi.getMSISDN() != JSON.parse(this.imiapi.getSession('childno'))
    )
      this.initializeChildImageUploader();
    else this.initializeImageUploader();
    this.uploader.onAfterAddingAll = (addedFileItems) => {
      let fileSizeInMb = 0;
      //alert('In onAfterAddingAll');
      for (let i = 0; i < this.uploader.queue.length; i++) {
        fileSizeInMb += this.uploader.queue[i].file.size;
      }
      //alert('fileSize' + fileSizeInMb);
      if (
        fileSizeInMb >
        parseInt(this.env.profileFileUploadSize.toString()) * 1024 * 1024
      ) {
        this.profilepicturemessage =
          this.imiapi.getSelectedLanguage() == 'EN'
            ? 'Uploaded photo likely exceeded the maximum file size (' +
              this.env.profileFileUploadSize +
              ' MB)'
            : 'Foto yang diunggah sepertinya melebihi ukuran file maksimum (' +
              this.env.profileFileUploadSize +
              ' MB)';
        $('#uploadsucess').modal('show');
        return;
      }
      this.spinner.show();
    };
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) =>
      this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItem(item, response, status, headers);
    this.uploader.onCompleteAll = () => {
      this.InputFrameVariable.nativeElement.value = '';
      if (
        this.imiapi.getSession('childno') != undefined &&
        this.imiapi.getSession('childno') != 'NA' &&
        this.imiapi.getMSISDN() != JSON.parse(this.imiapi.getSession('childno'))
      )
        this.initializeChildImageUploader();
      else this.initializeImageUploader();
    };
  }
  onErrorItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    //  alert('onerror' + response);
    // alert('status' + status);
    this.spinner.hide();
    let error = JSON.parse(response);
    console.log(response);
  }

  onSuccessItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    this.spinner.hide();
    let data = JSON.parse(response);
    //alert("data:"+data);
    console.log(data);
    if (data.data != null && data.data.status == 'true') {
      //remove session after sucessfull upload
      this.imiapi.removeSession('userprofileimage');
      this.getProfileImage();
      window.location.reload();
    } else {
      this.profilepicturemessage = data.message;
      $('#uploadsucess').modal('show');
    }
   

    if (
      this.imiapi.getSession('childno') != undefined &&
      this.imiapi.getSession('childno') != 'NA' &&
      this.imiapi.getMSISDN() != JSON.parse(this.imiapi.getSession('childno'))
    )
      this.initializeChildImageUploader();
    else this.initializeImageUploader();
  }
  closeModal() {
    $('#uploadsucess').modal('hide');
    window.location.reload();
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  goback() {
    this.router.navigate(['/userprofile']);
  }
  updateProfile() {
    if (
      this.userinfo.username != undefined &&
      this.userinfo.username != '' &&
      this.txtUserName.length < 3
    ) {
      this.usernameerror =
        this.imiapi.getSelectedLanguage() == 'EN'
          ? 'Name should be minimum 3 characters'
          : 'Masukkan minimal 3 karakter untuk nama';
      return;
    }
    if (this.txtUserName != '' && this.txtUserName != undefined) {
      const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (specialCharacters.test(this.txtUserName)) {
        this.usernameerror =
          this.imiapi.getSelectedLanguage() == 'EN'
            ? 'Special Characters are not allowed'
            : 'Karakter spesial tidak diperbolehkan';
        return;
      }
      const seperator = /[0-9!"£$%^&*()_+-=]/;
      let result = seperator.test(this.txtUserName);
      if (result) {
        this.usernameerror =
          this.imiapi.getSelectedLanguage() == 'EN'
            ? 'Only letters and spaces allowed'
            : 'Hanya diperbolehkan huruf dan spasi';
        return;
      }
    }

    this.spinner.show();
    this.msg = '';
    let userDob = '';
    // this.edituserinfo.dob = this.txtDob;
    if (this.txtDob != '' && this.txtDob != undefined) {
      // let dob = formatDate(this.txtDob, 'dd/MM/yyyy 00:00:00', 'en-US', '');
      let dob=moment(this.txtDob).format('DD/MM/yyyy 00:00:00.000').toString();
      this.edituserinfo.dob = dob;//.split(' ')[0];
    }
    if (this.userinfo.dob != undefined && this.userinfo.dob != '') {
      // userDob = formatDate(
      //   this.userinfo.dob,
      //   ' dd/MM/yyyy 00:00:00',
      //   'en-US',
      //   ''
      // );
      //  userDob=moment(this.userinfo.dob).format('DD-MM-YYYY 00:00:00.000').toString();
    }
    this.edituserinfo.referralcode = this.txtReferalCode;
    this.edituserinfo.name = this.txtUserName;
    if (this.txtEmailId != '' && this.userinfo.emailid != this.txtEmailId) {
      this.edituserinfo.email = this.txtEmailId;
      this.emailmsg =
        this.imiapi.getSelectedLanguage() == 'EN'
          ? 'Are you sure want to change your email to ' + this.txtEmailId
          : 'Yakin kamu ingin menggunakan email ' + this.txtEmailId;
      $('#emailVerify').modal('show');
      this.spinner.hide();
      return;
    }
    if (
      this.userinfo.username != this.txtUserName ||
      this.userinfo.emailid != this.txtEmailId ||
      userDob != this.edituserinfo.dob
    ) {
      this.imiapi.setSession('userupdated', true);
    }
    this.profileUpdate();
  }
  profileUpdate() {
    this.spinner.show();
    console.log(this.edituserinfo,"1321332343")
    this.imiapi.postData('v1/profile/update', this.edituserinfo).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null && response.status == '0') {
          // this.getCustomerProfile();
          if (this.txtReferalCode != '' && this.txtReferalCode != undefined) {
            this.redemMsg = response.data.mgmoffer;
            $('#popup001').modal('show');
          } else {
            this.router.navigate(['/userprofile']);
          }
        } else {
          this.msg = response.message;
        }
      },
      (error) => {
        console.log(error);
        this.msg =
          'Sorry, we could not process your request. Please try later.';
        this.spinner.hide();
      }
    );
  }

  getCustomerProfile() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response.data,"12345432123123")
        try {
          if (response.status == '0') {
            this.imiapi.setSession('oauth', response.data);
            this.userinfo = response.data;
            this.txtUserName =
              this.userinfo.username == undefined ? '' : this.userinfo.username;
            this.txtDob =
              this.userinfo.dob == undefined ? '' : this.userinfo.dob;
            this.txtEmailId =
              this.userinfo.emailid == undefined ? '' : this.userinfo.emailid;
            this.calculateDiff(this.userinfo.createdon);
            //this.getCustomerImage();
            this.getProfileImage();
          }
        } catch (e) {
          console.log(e);
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  calculateDiff(data) {
    console.log('In calculateDiff' + data);
    let ddMMyy = moment(data, 'YYYYMMDD');
    let datedot = ddMMyy.format('yyyy/MM/DD');
    var expirydate: any = new Date(datedot);
    var currentdate: any = new Date();
    console.log('datedot:' + datedot);
    console.log('Exipry Date:' + expirydate);
    console.log('Current Date:' + currentdate);
    this.days = Math.floor(
      (currentdate.getTime() - expirydate.getTime()) / 1000 / 60 / 60 / 24
    );
  }

  titleCheck(event) {
    // var k;
    // k = event.charCode; //         k = event.keyCode;  (Both can be used)
    // return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32; e.keyCode || e.which
    console.log(event.charCode + ' - ' + event.which);
    var regex = new RegExp('^[a-z A-Z]');
    var key = String.fromCharCode(
      event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  navigateToAccount() {
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.router.navigate(['/myaccount']);
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  initializeImageUploader() {
    this.uploader = new FileUploader({
      url: this.imiapi.getUrl('v1/profile/pwa/uploadphoto',"dummyvalue"),
      disableMultipart: false,
      autoUpload: true,
      method: 'post',
      itemAlias: 'attachment',
      headers: [
        { name: 'X-IMI-TOKENID', value: this.imiapi.getSession('token') },
        { name: 'Access-Control-Allow-Origin', value: '*' },
        { name: 'X-IMI-NETWORK', value: 'WIFI' },
        { name: 'X-IMI-CHANNEL', value: this.env.hdrChannel },
        { name: 'X-IMI-LANGUAGE', value: this.imiapi.getSelectedLanguage() },
        { name: 'X-IMI-App-Model', value: this.imiapi.getPhoneModel() },
        { name: 'X-IMI-App-OS', value: this.imiapi.getOS() },
        { name: 'X-IMI-App-OSVersion', value: this.imiapi.getOSVersion() },
        { name: 'X-IMI-App-User-Agent', value: navigator.userAgent },
        { name: 'X-IMI-UID', value: '11111' },
        { name: 'X-IMI-VERSION', value: this.env.hdrVersion },
        //{ name: 'proxypath', value: 'v1/profile/pwa/uploadphoto' },
      ],
      allowedMimeType: ['image/png', 'image/gif', 'image/jpeg'],
    });
  }
  initializeChildImageUploader() {
    this.uploader = new FileUploader({
      url: this.imiapi.getUrl('v1/profile/pwa/uploadphoto',"dummyvalue"),
      disableMultipart: false,
      autoUpload: true,
      method: 'post',
      itemAlias: 'attachment',
      headers: [
        { name: 'X-IMI-TOKENID', value: this.imiapi.getSession('token') },
        { name: 'Access-Control-Allow-Origin', value: '*' },
        { name: 'X-IMI-NETWORK', value: 'WIFI' },
        { name: 'X-IMI-CHANNEL', value: this.env.hdrChannel },
        { name: 'X-IMI-LANGUAGE', value: this.imiapi.getSelectedLanguage() },
        { name: 'X-IMI-App-Model', value: this.imiapi.getPhoneModel() },
        { name: 'X-IMI-App-OS', value: this.imiapi.getOS() },
        { name: 'X-IMI-App-OSVersion', value: this.imiapi.getOSVersion() },
        { name: 'X-IMI-App-User-Agent', value: navigator.userAgent },
        { name: 'X-IMI-UID', value: '11111' },
        { name: 'X-IMI-VERSION', value: this.env.hdrVersion },
        {
          name: 'X-IMI-CHILD-LINENO',
          value: this.imiapi.EncryptDecrypt(
            JSON.parse(this.imiapi.getSession('childno'))
          ),
        },
        //{ name: 'proxypath', value: 'v1/profile/pwa/uploadphoto' },
      ],
      allowedMimeType: ['image/png', 'image/gif', 'image/jpeg'],
    });
  }
  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    console.log(file);
    this.uploader.uploadItem(event[0]);
  }
  getProfileImage() {
    this.userimage = this.env.cdnurl + 'assets/images/nophoto.jpg';
    let profileImage = this.imiapi.getSession('userprofileimage');
    if (
      profileImage != 'undefined' &&
      profileImage != 'NA' &&
      profileImage != ''
    ) {
      this.userimage = JSON.parse(profileImage);
    } else {
      this.spinner.show();
      try {
        this.imiapi
          .postData('v1/profile/downloadphoto/v2', {})
          .toPromise()
          .then((response: any) => {
            this.spinner.hide();
            this.imiapi.setSession('userprofileimage', response);
            this.userimage = response;
          })
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
          });
      } catch (e) {
        this.spinner.hide();
        console.log(e);
      }
    }
  }
}
