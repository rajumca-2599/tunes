import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { MyaccComponent } from './myacc/myacc.component';
import { AuthComponent } from './auth/auth.component';
import { ValidateOtpComponent } from './auth/validate-otp/validate-otp.component';
import { UserComponent } from './user/user.component';
import { AuthguardService } from './shared/authguard.service';
import { LoginguardService } from './shared/loginguard.service';
import { HeComponent } from './auth/he/he.component';
import { AppredirectComponent } from './shared/appredirect/appredirect.component';
import { ManagenoLandingComponent } from './home/manage-number/manageno-landing/manageno-landing.component';
import { AddManagenoComponent } from './home/manage-number/add-manageno/add-manageno.component';
import { ManagenoValidateotpComponent } from './home/manage-number/manageno-validateotp/manageno-validateotp.component';
import { InboxLandingComponent } from './home/message-inbox/inbox-landing/inbox-landing.component';
import { TopUpComponent } from './home/buy-topup/top-up/top-up.component';
import { TopUpPaymentComponent } from './home/buy-topup/top-up-payment/top-up-payment.component';
import { TopUpSucessComponent } from './home/buy-topup/top-up-sucess/top-up-sucess.component';
import { TopUpFailedComponent } from './home/buy-topup/top-up-failed/top-up-failed.component';
import { TimelimitComponent } from './home/buy-topup/timelimit/timelimit.component';
import { PackageLandingComponent } from './home/package/package-landing/package-landing.component';
import { ViewPackageComponent } from './home/package/view-package/view-package.component';
import { ViewPackagelistComponent } from './home/package/view-packagelist/view-packagelist.component';
import { SearchLandingComponent } from './home/search/search-landing/search-landing.component';
import { TransHistoryComponent } from './myacc/trans-history/trans-history.component';
import { TransDetailsComponent } from './myacc/trans-details/trans-details.component';
import { BillingHistoryComponent } from './myacc/billing-history/billing-history.component';
import { MoreLandingComponent } from './more/more-landing/more-landing.component';
import { PaymentcallbackComponent } from './home/buy-topup/paymentcallback/paymentcallback.component';
import { BillingDetailsComponent } from './myacc/billing-details/billing-details.component';
import { VoucherPaymentComponent } from './home/buy-topup/voucher-payment/voucher-payment.component';
import { PaybillComponent } from './home/buy-topup/paybill/paybill.component';
import { ViewMessageComponent } from './home/message-inbox/view-message/view-message.component';
import { PinPukinfoComponent } from './more/pin-pukinfo/pin-pukinfo.component';
import { ReadinesComponent } from './more/readines/readines.component';
import { UserprofileComponent } from './more/userprofile/userprofile.component';
import { EditUserComponent } from './more/edit-user/edit-user.component';
import { ReadinessCoverageComponent } from './more/readiness-coverage/readiness-coverage.component';
import { CoverageSearchComponent } from './more/coverage-search/coverage-search.component';
import { CoverageFeedbackComponent } from './more/coverage-feedback/coverage-feedback.component';
import { CoverageBadfeedbackComponent } from './more/coverage-badfeedback/coverage-badfeedback.component';
import { RewardsLandingComponent } from './rewards/rewards-landing/rewards-landing.component';
import { InviteFriendsComponent } from './rewards/invite-friends/invite-friends.component';
import { StoreLocatorsComponent } from './more/store-locators/store-locators.component';
import { StoreLocatorsDetailsComponent } from './more/store-locators-details/store-locators-details.component';
import { AccountUsageHistoryComponent } from './myacc/account-usage-history/account-usage-history.component';
import { OnlyForYouDetailsComponent } from './home/only-for-you-details/only-for-you-details.component';
import { PaymentFeedbackComponent } from './home/buy-topup/payment-feedback/payment-feedback.component';
import { UserFeedbackComponent } from './shared/user-feedback/user-feedback.component';
import { OcwloginComponent } from './auth/ocwlogin/ocwlogin.component';
import { Error400Component } from './shared/error400/error400.component';
import { PartnerloginComponent } from './partner/partnerlogin/partnerlogin.component';
import { PartnerdashboardComponent } from './partner/partnerdashboard/partnerdashboard.component';
import { PartnervalidateotpComponent } from './partner/partnervalidateotp/partnervalidateotp.component';
import { PartnertermsandconditionComponent } from './partner/partnertermsandcondition/partnertermsandcondition.component';
import { PartnerlistComponent } from './partnerlist/partnerlist.component';
import { PartnerdetailsComponent } from './partnerdetails/partnerdetails.component';

const routes: Routes = [
  /* { path: '', component: HeComponent,canActivate:[LoginguardService]  }, */
  { path: '', component: HeComponent },
  { path: 'pwa', component: HeComponent },
  { path: 'he/:id', component: HeComponent },
  { path: 'getapp', component: AppredirectComponent },
  { path: 'login', component: AuthComponent, canActivate: [LoginguardService] },
  {
    path: 'validateotp',
    component: ValidateOtpComponent,
    canActivate: [LoginguardService],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthguardService],
    data: { animation: 'isRight' },
  },
  {
    path: 'myaccount',
    component: MyaccComponent,
    canActivate: [AuthguardService],
    data: { animation: 'isLeft' },
  },
  {
    path: 'updateprofile',
    component: UserComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'managenumber',
    component: ManagenoLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'addnumber',
    component: AddManagenoComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'managevalidateotp',
    component: ManagenoValidateotpComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'messageinbox',
    component: InboxLandingComponent,
    canActivate: [AuthguardService],
  },
  { path: 'topup', component: TopUpComponent, canActivate: [AuthguardService] },
  {
    path: 'topuppayment',
    component: TopUpPaymentComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'topuptimelimit',
    component: TimelimitComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'sucess',
    component: TopUpSucessComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'failed',
    component: TopUpFailedComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'inbox/:sourcescreen',
    component: InboxLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'viewmessage/:sourcescreen',
    component: ViewMessageComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'package',
    component: PackageLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'viewpackagelist',
    component: ViewPackagelistComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'category',
    component: ViewPackagelistComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'viewpackage',
    component: ViewPackageComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'packagesearch/:sourcescreen',
    component: SearchLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'billingdetails',
    component: BillingDetailsComponent,
    canActivate: [AuthguardService],
  },
  // !TICKET! :: Added by ashok.t for Trnsaction History
  {
    path: 'transhistory',
    component: TransHistoryComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'transdetails',
    component: TransDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'billinghistory',
    component: BillingHistoryComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'more',
    component: MoreLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'paymentcallback',
    component: PaymentcallbackComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'voucher',
    component: VoucherPaymentComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'paybill',
    component: PaybillComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'pinpuk',
    component: PinPukinfoComponent,
    canActivate: [AuthguardService],
  },
  {
    path: '4greadiness',
    component: ReadinesComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'userprofile',
    component: UserprofileComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'editprofile',
    component: EditUserComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'coverage',
    component: ReadinessCoverageComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'coveragesearch',
    component: CoverageSearchComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'coveragefeedback',
    component: CoverageFeedbackComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'coveragebadfeedback',
    component: CoverageBadfeedbackComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'rewards',
    component: RewardsLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'rewards/:src',
    component: RewardsLandingComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'invitefriends',
    component: InviteFriendsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'storelocators',
    component: StoreLocatorsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'locator_details',
    component: StoreLocatorsDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'usagehistory',
    component: AccountUsageHistoryComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'onlyforyou',
    component: OnlyForYouDetailsComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'paymentfeedback',
    component: PaymentFeedbackComponent,
    canActivate: [AuthguardService],
  },
  {
    path: 'userfeedback',
    component: UserFeedbackComponent,
    canActivate: [AuthguardService],
  },
  {
    path:'partnerlist',
    component:PartnerlistComponent
  },
  {
    path:'partnerdetails',
    component:PartnerdetailsComponent
  },
  {
    path: 'ocwlogin/:fid/:data/:refererurl/:webtoken',
    component: OcwloginComponent,
  },
  {
    path: 'ocwlogin/:fid/:data/:refererurl/:webtoken/:accesstoken',
    component: OcwloginComponent,
  },
  { path: 'sso/:routeurl/:refererurl/:webtoken', component: OcwloginComponent },
  {
    path: 'sso/:routeurl/:refererurl/:webtoken/:accesstoken',
    component: OcwloginComponent,
  },
  {
    path: 'webpkg/:pvrcode/:refererurl/:webtoken',
    component: OcwloginComponent,
  },
  {
    path: 'webpkg/:pvrcode/:refererurl/:webtoken/:accesstoken',
    component: OcwloginComponent,
  },
  {path:'partnerlogin',
  component: PartnerloginComponent,
  
},
  {path:'partnervalidateotp',
  component:PartnervalidateotpComponent,
 
},
  {path:'partnerdashboard',
  component: PartnerdashboardComponent,
 
},
  {path:'partnerterms&conditions',
  component: PartnertermsandconditionComponent,
 
},
  { path: 'error400', component: Error400Component },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
