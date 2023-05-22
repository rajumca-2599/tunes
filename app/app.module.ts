import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { EnvServiceProvider } from './shared/env.service.provider';
import { IMIapiService } from './shared/imiapi.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MyaccComponent } from './myacc/myacc.component';
import { UserComponent } from './user/user.component';

import { AuthComponent } from './auth/auth.component';
import { ValidateOtpComponent } from './auth/validate-otp/validate-otp.component';

import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { TopSliderComponent } from './home/top-slider/top-slider.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';
import { PromotionsComponent } from './home/promotions/promotions.component';
import { RecommendationsComponent } from './home/recommendations/recommendations.component';
import { PopularContentComponent } from './home/popular-content/popular-content.component';
import { HeaderComponent } from './shared/header/header.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TopdrawerComponent } from './shared/topdrawer/topdrawer.component';
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from 'src/environments/environment';
import { NumbersOnlyDirective } from './shared/directives/numbers-only.directive';
import { CommonModule, DatePipe, formatDate } from "@angular/common";
import { HistoryComponent } from './myacc/history/history.component';
import { SpecialpackageComponent } from './myacc/specialpackage/specialpackage.component';
import { QuotaComponent } from './myacc/quota/quota.component';
import { SubscriptionsComponent } from './myacc/subscriptions/subscriptions.component';
import { AccdashboardComponent } from './myacc/accdashboard/accdashboard.component';

import { SafeCharsDirective } from './shared/directives/safe-chars.directive';
import { TitleCharsDirective } from './shared/directives/title-chars.directive';
import { LoaderComponent } from './shared/loader/loader.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule ,BsModalRef } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from './shared/cta-modal/cta-modal.component';
import { AmountConverterPipe } from './shared/directives/amount-converter.pipe';
import { PayModalComponent } from './shared/pay-modal/pay-modal.component';
import { PopularPackageComponent } from './home/popular-package/popular-package.component';
import { AppredirectComponent } from './shared/appredirect/appredirect.component';
import { HeaderPrimarylinesComponent } from './shared/header-primarylines/header-primarylines.component';
import { ManagenoLandingComponent } from './home/manage-number/manageno-landing/manageno-landing.component';
import { AddManagenoComponent } from './home/manage-number/add-manageno/add-manageno.component';
import { ManagenoValidateotpComponent } from './home/manage-number/manageno-validateotp/manageno-validateotp.component';
import { InboxLandingComponent } from './home/message-inbox/inbox-landing/inbox-landing.component';
import { TopUpComponent } from './home/buy-topup/top-up/top-up.component';
import { TopUpPaymentComponent } from './home/buy-topup/top-up-payment/top-up-payment.component';
import { TopUpFailedComponent } from './home/buy-topup/top-up-failed/top-up-failed.component';
import { TopUpSucessComponent } from './home/buy-topup/top-up-sucess/top-up-sucess.component';
import { TimelimitComponent } from './home/buy-topup/timelimit/timelimit.component';
import { PackageLandingComponent } from './home/package/package-landing/package-landing.component';
import { ViewPackageComponent } from './home/package/view-package/view-package.component';
import { ViewPackagelistComponent } from './home/package/view-packagelist/view-packagelist.component';
import { SearchLandingComponent } from './home/search/search-landing/search-landing.component';
import { TransHistoryComponent } from './myacc/trans-history/trans-history.component';
import { TransDetailsComponent } from './myacc/trans-details/trans-details.component';
import { SharedService } from './shared/SharedService';
import { BillingHistoryComponent } from './myacc/billing-history/billing-history.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AdvancePromotionsComponent } from './home/advance-promotions/advance-promotions.component';
import { SafeHtmlPipe } from './shared/directives/safe-html.pipe';
import { MoreLandingComponent } from './more/more-landing/more-landing.component';
import { PaymentcallbackComponent } from './home/buy-topup/paymentcallback/paymentcallback.component';
import { BillingDetailsComponent } from './myacc/billing-details/billing-details.component';
import { VoucherPaymentComponent } from './home/buy-topup/voucher-payment/voucher-payment.component';
import { PaybillComponent } from './home/buy-topup/paybill/paybill.component';
import { ConvertDate } from './shared/directives/convert-date.pipe';
import { ViewMessageComponent } from './home/message-inbox/view-message/view-message.component';
import { TruncatePipe } from './shared/directives/truncate.pipe';
import { PinPukinfoComponent } from './more/pin-pukinfo/pin-pukinfo.component';
import { ReadinesComponent } from './more/readines/readines.component';
import { UserprofileComponent } from './more/userprofile/userprofile.component';
import { EditUserComponent } from './more/edit-user/edit-user.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { ReadinessCoverageComponent } from './more/readiness-coverage/readiness-coverage.component';
import { CoverageSearchComponent } from './more/coverage-search/coverage-search.component';
import { SearchPipe } from './shared/directives/search.pipe';
import { AgmCoreModule } from '@agm/core';
import { CoverageFeedbackComponent } from './more/coverage-feedback/coverage-feedback.component';
import { CoverageBadfeedbackComponent } from './more/coverage-badfeedback/coverage-badfeedback.component';
import { StoreLocatorsComponent } from './more/store-locators/store-locators.component';
import { RewardsLandingComponent } from './rewards/rewards-landing/rewards-landing.component';
import { InviteFriendsComponent } from './rewards/invite-friends/invite-friends.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreLocatorsDetailsComponent } from './more/store-locators-details/store-locators-details.component';
import { AccountUsageHistoryComponent } from './myacc/account-usage-history/account-usage-history.component';
import { ChartsModule } from 'ng2-charts';
import { OnlyForYouComponent } from './home/only-for-you/only-for-you.component';
import { OnlyForYouDetailsComponent } from './home/only-for-you-details/only-for-you-details.component';
import { PaymentFeedbackComponent } from './home/buy-topup/payment-feedback/payment-feedback.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserFeedbackComponent } from './shared/user-feedback/user-feedback.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Error400Component } from './shared/error400/error400.component';
import { WelcomeModalComponent } from './shared/welcome-modal/welcome-modal.component';
import { PartnerloginComponent } from './partner/partnerlogin/partnerlogin.component';
import { PartnerdashboardComponent } from './partner/partnerdashboard/partnerdashboard.component';
import { PartnervalidateotpComponent } from './partner/partnervalidateotp/partnervalidateotp.component';
import { PartnertermsandconditionComponent } from './partner/partnertermsandcondition/partnertermsandcondition.component';
import { PartnerlistComponent } from './partnerlist/partnerlist.component';
import { PartnerdetailsComponent } from './partnerdetails/partnerdetails.component';
import { AnotherheaderComponent } from './shared/anotherheader/anotherheader.component';
import { ReplacePipe } from './replace.pipe';


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyaccComponent,
    UserComponent,
    AuthComponent,
    ValidateOtpComponent,
    PageNotFoundComponent,
    DashboardComponent,
    TopSliderComponent,
    PopularContentComponent,
    RecommendationsComponent,
    PromotionsComponent,
    FooterComponent,
    HeaderComponent,
    TopdrawerComponent,
    NumbersOnlyDirective,
    HistoryComponent,
    SpecialpackageComponent,
    QuotaComponent,
    SubscriptionsComponent,
    AccdashboardComponent,
    SafeCharsDirective,
    TitleCharsDirective,
    LoaderComponent,
    CtaModalComponent,
    AmountConverterPipe,
    PayModalComponent,
    PopularPackageComponent,
    AppredirectComponent,
    HeaderPrimarylinesComponent,
    ManagenoLandingComponent,
    AddManagenoComponent,
    ManagenoValidateotpComponent,
    InboxLandingComponent,
    TopUpComponent,
    TopUpPaymentComponent,
    TopUpSucessComponent,
    TopUpFailedComponent,
    TimelimitComponent,
    PackageLandingComponent,
    ViewPackageComponent,
    ViewPackagelistComponent,
    SearchLandingComponent,
    TransHistoryComponent,
    TransDetailsComponent,
    BillingHistoryComponent,
    AdvancePromotionsComponent,
    SafeHtmlPipe,
    MoreLandingComponent,
    PaymentcallbackComponent,
    BillingDetailsComponent,
    VoucherPaymentComponent,
    PaybillComponent,
    ConvertDate,
    ViewMessageComponent,
    TruncatePipe,
    PinPukinfoComponent,
    ReadinesComponent,
    UserprofileComponent,
    EditUserComponent,
    ReadinessCoverageComponent,
    CoverageSearchComponent,
    SearchPipe,
    CoverageFeedbackComponent,
    CoverageBadfeedbackComponent,
    StoreLocatorsComponent,
    RewardsLandingComponent,
    InviteFriendsComponent,
    StoreLocatorsDetailsComponent,
    AccountUsageHistoryComponent,
    OnlyForYouComponent,
    OnlyForYouDetailsComponent ,
    PaymentFeedbackComponent,
    UserFeedbackComponent,
    Error400Component,
    WelcomeModalComponent,
    PartnerloginComponent,
    PartnerdashboardComponent,
    PartnervalidateotpComponent,
    PartnertermsandconditionComponent,
    PartnerlistComponent,
    PartnerdetailsComponent,
    AnotherheaderComponent,
    ReplacePipe  
  ],
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    SwiperModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('main-sw.js', { enabled: environment.production }),
    CommonModule,
    NgOtpInputModule,
    InfiniteScrollModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BsDatepickerModule.forRoot(),
    SocialLoginModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD75sgu4OUwdTkuGcBhSY720OAjCh01vHM'
    }),
      ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    FontAwesomeModule,
    ChartsModule,
    NgxSliderModule,
    FileUploadModule
    //,
    // DatePipe
  ],
  providers: [IMIapiService, EnvServiceProvider,BsModalRef,SharedService, { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },Title,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '876546145137-2sal1vrlirv3un7m8eiq7csg4cr6o4ch.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2572246932852997')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CtaModalComponent]
})
export class AppModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');
}
