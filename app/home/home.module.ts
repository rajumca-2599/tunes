import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SelectModule } from 'ng2-select';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../shared/modules/material/material.module';
import { MatToolbarModule, MatInputModule, MatTableModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularEditorModule } from '@kolkov/angular-editor/';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';


import { ValidatepatternDirective } from '../shared/directives/validatepattern.directive';

import { LangFilterPipe } from '../shared/pipes/languagefilter';
import { Customurl } from '../shared/pipes/customurlpipe';
import { NumbersOnlyDirective } from '../shared/directives/numbersonly';
import { DecimalNumberDirective } from '../shared/directives/decimal-number';
import { SafeCharsDirective } from '../shared/directives/safe-chars';
import { TitleCharsDirective } from '../shared/directives/title-chars'
import { TitlespecialDirective } from '../shared/directives/titlespecial.directive'
import { PackagemasterDirective } from '../shared/directives/packagemaster.directive';

import { HomeComponent } from './home.component';
import { UserslistComponent } from './components/userslist/userslist.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ManageRightsComponent } from './components/manage-rights/manage-rights.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { OfferPacksComponent } from './components/offer-packs/offer-packs.component';
import { AddofferPackComponent } from './components/addoffer-pack/addoffer-pack.component';
import { ChannelsComponent } from './components/masters/channels/channels.component';
import { AttributesComponent } from './components/masters/attributes/attributes.component';
import { RulesComponent } from './components/masters/rules/rules.component';
import { AddChannelComponent } from './components/masters/channels/add-channel/add-channel.component';
import { AddRuleComponent } from './components/masters/rules/add-rule/add-rule.component';
import { AddAttributeComponent } from './components/masters/attributes/add-attribute/add-attribute.component';
import { CategoriesComponent } from './components/masters/categories/categories.component';
import { AddCategoriesComponent } from './components/masters/categories/add-categories/add-categories.component';
import { PackagelistComponent } from './components/packages/packagelist/packagelist.component';
import { AddPackagelistComponent } from './components/packages/packagelist/add-packagelist/add-packagelist.component';
import { PackagedefComponent } from './components/packages/packagedef/packagedef.component';
import { AddPackagedefComponent } from './components/packages/packagedef/add-packagedef/add-packagedef.component';
import { MappingComponent } from './components/packages/mapping/mapping.component';
import { AddMappingComponent } from './components/packages/mapping/add-mapping/add-mapping.component';
import { MessageslistComponent } from './components/settings/messageslist/messageslist.component';
import { AddMessageslistComponent } from './components/settings/messageslist/add-messageslist/add-messageslist.component';
import { EmailtemplateComponent } from './components/templates/emailtemplate/emailtemplate.component';
import { AddEmailtemplateComponent } from './components/templates/emailtemplate/add-emailtemplate/add-emailtemplate.component';
import { PlatformsettingsComponent } from './components/settings/platformsettings/platformsettings.component';
import { AddPlatformsettingsComponent } from './components/settings/platformsettings/add-platformsettings/add-platformsettings.component';

import { BannerComponent } from './components/assetmanagement/banner/banner.component';
import { BannergroupComponent } from './components/assetmanagement/bannergroup/bannergroup.component';
import { AddBannerComponent } from './components/assetmanagement/banner/add-banner/add-banner.component';
import { AddBannergroupComponent } from './components/assetmanagement/bannergroup/add-bannergroup/add-bannergroup.component';
import { ManageBannerComponent } from './components/assetmanagement/bannergroup/manage-banner/manage-banner.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MultialertComponent } from './components/masters/multialert/multialert.component';
import { AddMultialertComponent } from './components/masters/multialert/add-multialert/add-multialert.component';
import { PageListComponent } from './components/pagemanagement/page-list/page-list.component';
import { ModuleListComponent } from './components/pagemanagement/module-list/module-list.component';
import { ModuleConfigurationComponent } from './components/pagemanagement/module-configuration/module-configuration.component';
import { ModuleStatusChangeComponent } from './components/pagemanagement/module-status-change/module-status-change.component';
import { ShowImageComponent } from './components/shared/show-image/show-image.component';
import { ReportsListComponent } from './components/reports/reports-list/reports-list.component';
import { CcareIndexComponent } from './components/customercare/ccare-index/ccare-index.component';
import { PublishComponent } from './components/publish/publish.component';
import { OtpHistoryComponent } from './components/customercare/ccare-index/otp-history/otp-history.component';
import { TransHistoryComponent } from './components/customercare/ccare-index/trans-history/trans-history.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageManagementComponent } from './components/pagemanagement/page-management.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { TranslationsComponent } from './components/settings/translations/translations.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { Error400Component } from './components/shared/error400/error400.component';
import { Error403Component } from './components/shared/error403/error403.component';
import { Error405Component } from './components/shared/error405/error405.component';
import { SpecialconfigComponent } from './components/packages/specialconfig/specialconfig.component';
import { AddSpecialconfigComponent } from './components/packages/specialconfig/add-specialconfig/add-specialconfig.component';
import { SegmentsComponent } from './components/masters/segments/segments.component';
import { ManagealertComponent } from './components/masters/multialert/managealert/managealert.component';
import { FourgcitiesComponent } from './components/masters/fourgcities/fourgcities.component';
import { PopularpackagesComponent } from './components/packages/popularpackages/popularpackages.component';
import { SpinsegmentComponent } from './components/spinthewheel/spinsegment/spinsegment.component';
import { SpinpackmasterComponent } from './components/spinthewheel/spinpackmaster/spinpackmaster.component';
import { VouchersComponent } from './components/spinthewheel/vouchers/vouchers.component';

import { MasterassetsComponent } from './components/assetmanagement/masterassets/masterassets.component';
import { GatewayipsComponent } from './components/masters/gatewayips/gatewayips.component';


import { IprangeDirective } from '../shared/directives/iprange.directive';
import { PasswordcharsDirective } from '../shared/directives/passwordchars.directive';
import { SpinrulesComponent } from './components/spinthewheel/spinrules/spinrules.component';
import { RefreshComponent } from './components/settings/refresh/refresh.component';
import { AddspinmasterComponent } from './components/spinthewheel/spinpackmaster/addspinpackmaster/addspinmaster.component';

import { AddspinpackmasterComponent } from './components/spinthewheel/spinpackmaster/addspinpackmaster/addspinpackmaster.component';

import { AuditlogsComponent } from './components/auditlogs/auditlogs.component';
import { AppratingComponent } from './components/reports/apprating/apprating.component';
import { ProfileComponent } from './components/customercare/profile/profile.component';
import { WhitelistsegmentsComponent } from './components/masters/whitelistsegments/whitelistsegments.component';
import { ReportsinboxComponent } from './components/reports/reportsinbox/reportsinbox.component';
import { VoceMasterComponent } from './components/Voce/voce-master/voce-master.component';
import { AddVoceMasterComponent } from './components/Voce/voce-master/add-voce-master/add-voce-master.component';
import { VoceEventsComponent } from './components/Voce/voce-events/voce-events.component';
import { VoceQuestionsComponent } from './components/Voce/voce-questions/voce-questions.component';
import { AddVoceQuestionsComponent } from './components/Voce/voce-questions/add-voce-questions/add-voce-questions.component';
import { VoceOptionsComponent } from './components/Voce/voce-options/voce-options.component';
import { AddVoceOptionsComponent } from './components/Voce/voce-options/add-voce-options/add-voce-options.component';
import { EventMappingComponent } from './components/Voce/voce-events/event-mapping/event-mapping.component';
import { EditOptionsComponent } from './components/Voce/voce-options/edit-options/edit-options.component';
import { RssMasterComponent } from './components/RSS/rss-master/rss-master.component';
import { AddRssMasterComponent } from './components/RSS/add-rss-master/add-rss-master.component';
import { EditRssTemplateComponent } from './components/RSS/edit-rss-template/edit-rss-template.component';
import { RssDataListComponent } from './components/RSS/rss-data-list/rss-data-list.component';
import { ViewDataComponent } from './components/RSS/view-data/view-data.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ProtipalertsComponent } from './components/protipalerts/protipalerts.component';
import { AddprotipComponent } from './components/protipalerts/addprotip/addprotip.component';
import { CircleListComponent } from './components/circle/circle-list/circle-list.component';
import { BundlesListComponent } from './components/bundles/bundles-list/bundles-list.component';
import { ValidationRulesListComponent } from './components/validation-rules/validation-rules-list/validation-rules-list.component';
import { PackagesListComponent } from './components/circle/packages/packages-list/packages-list.component';
import { PackagesMappingComponent } from './components/circle/packages/packages-mapping/packages-mapping.component';

import { PackageAttributesComponent } from './components/circle/packages/package-attributes/package-attributes.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PaymentTransactionsComponent } from './components/customercare/payment-transactions/payment-transactions.component';
import { TransactionstatusComponent } from './components/customercare/payment-transactions/transactionstatus/transactionstatus.component';
import { UploadHistoryComponent } from './components/upload-history/upload-history.component';
import { AddPackageComponent } from './components/circle/packages/add-package/add-package.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import { EncryptdeeplinkComponent } from './encryptdeeplink/encryptdeeplink.component';
import { EventBasedPushNotificationsComponent } from './components/event-based-push-notifications/event-based-push-notifications.component';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    HomeComponent, UserslistComponent, AddUserComponent,
    Customurl,
    ResetPasswordComponent,
    ManageRightsComponent,
    MyprofileComponent,
    OfferPacksComponent,
    AddofferPackComponent,
    ChannelsComponent,
    AttributesComponent,
    RulesComponent,
    AddChannelComponent,
    NotificationsComponent,
    AddRuleComponent,
    AddAttributeComponent,
    CategoriesComponent,
    AddCategoriesComponent,
    PackagelistComponent,
    AddPackagelistComponent,
    PackagedefComponent,
    AddPackagedefComponent,
    MappingComponent,
    AddMappingComponent,
    MessageslistComponent,
    AddMessageslistComponent,
    EmailtemplateComponent,
    AddEmailtemplateComponent,
    PlatformsettingsComponent,
    AddPlatformsettingsComponent,
    BannerComponent,
    BannergroupComponent,
    AddBannerComponent,
    ValidatepatternDirective,
    AddBannergroupComponent,
    ManageBannerComponent,
    MultialertComponent,
    AddMultialertComponent,
    ManagealertComponent,
    PageListComponent,
    ModuleListComponent,
    ModuleConfigurationComponent,
    ModuleStatusChangeComponent,
    CcareIndexComponent,
    ReportsListComponent,
    PageManagementComponent,
    ShowImageComponent,
    PublishComponent,
    OtpHistoryComponent,
    TransHistoryComponent,
    DashboardComponent,
    TranslationsComponent,
    Error400Component,
    Error403Component,
    Error405Component,

    NumbersOnlyDirective,
    LangFilterPipe,
    DecimalNumberDirective,
    SafeCharsDirective,
    TitleCharsDirective,
    TitlespecialDirective,
    PackagemasterDirective,
    SpecialconfigComponent,
    AddSpecialconfigComponent,
    SegmentsComponent,
    ManagealertComponent,
    FourgcitiesComponent,
    PopularpackagesComponent,
    SpinsegmentComponent,
    SpinpackmasterComponent,
    MasterassetsComponent,
    GatewayipsComponent,
    VouchersComponent,
    IprangeDirective,
    PasswordcharsDirective,
    SpinrulesComponent,
    RefreshComponent,
    AddspinmasterComponent,
    AddspinpackmasterComponent,
    AuditlogsComponent,
    AppratingComponent,
    ProfileComponent,
    //Added for #Jira id:DIGITAL-3211
    WhitelistsegmentsComponent,
    //Added for #Jira id:DIGITAL-3447
    ReportsinboxComponent,
    VoceMasterComponent,
    AddVoceMasterComponent,
    VoceEventsComponent,
    VoceQuestionsComponent,
    AddVoceQuestionsComponent,
    VoceOptionsComponent,
    AddVoceOptionsComponent,
    EventMappingComponent,
    EditOptionsComponent,
    RssMasterComponent,
    AddRssMasterComponent,
    EditRssTemplateComponent,
    RssDataListComponent,
    ViewDataComponent,
    ProtipalertsComponent,AddprotipComponent, CircleListComponent, BundlesListComponent, ValidationRulesListComponent, PackagesListComponent, PackagesMappingComponent, PackageAttributesComponent, FileUploadComponent, PaymentTransactionsComponent, TransactionstatusComponent, UploadHistoryComponent, AddPackageComponent, EncryptdeeplinkComponent, EventBasedPushNotificationsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,

    MaterialModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularEditorModule,
    // SelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ColorPickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      applyLabel: 'OK',
    }),
    DragDropModule,
    MatCarouselModule,
    AngularFileUploaderModule,
    PlotlyModule,
    NgxJsonViewerModule 
  ],
  entryComponents: [
    AddUserComponent,
    ResetPasswordComponent,
    AddChannelComponent,
    AddRuleComponent,
    AddAttributeComponent,
    AddCategoriesComponent,
    AddPackagedefComponent,
    AddMessageslistComponent,
    AddEmailtemplateComponent,
    AddPlatformsettingsComponent,
    AddBannergroupComponent,
    AddBannerComponent,
    AddMultialertComponent, ManagealertComponent,
    ModuleConfigurationComponent,
    ModuleStatusChangeComponent,
    ShowImageComponent, PageManagementComponent,
    AddSpecialconfigComponent,
    AddspinmasterComponent,
    AuditlogsComponent,
    EventMappingComponent,
    EditOptionsComponent,
    AddRssMasterComponent,
    EditRssTemplateComponent,
    ViewDataComponent,
    AddprotipComponent,
    PackagesMappingComponent,
    PackageAttributesComponent,
    FileUploadComponent,
    TransactionstatusComponent,
    UploadHistoryComponent,
    AddPackageComponent
  ], bootstrap: [PageManagementComponent]
})
export class HomeModule { }
