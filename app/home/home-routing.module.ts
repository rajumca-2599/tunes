import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { HomeComponent } from "./home.component";
import { UserslistComponent } from "./components/userslist/userslist.component";
import { ManageRightsComponent } from "./components/manage-rights/manage-rights.component";
import { MyprofileComponent } from "./components/myprofile/myprofile.component";
import { OfferPacksComponent } from "./components/offer-packs/offer-packs.component";
import { SpinrulesComponent } from "./components/spinthewheel/spinrules/spinrules.component";
import { ChannelsComponent } from "./components/masters/channels/channels.component";
import { AttributesComponent } from "./components/masters/attributes/attributes.component";
import { RulesComponent } from "./components/masters/rules/rules.component";
import { CategoriesComponent } from "./components/masters/categories/categories.component";
import { PackagedefComponent } from "./components/packages/packagedef/packagedef.component";
import { PackagelistComponent } from "./components/packages/packagelist/packagelist.component";
import { AddPackagelistComponent } from "./components/packages/packagelist/add-packagelist/add-packagelist.component";
import { MappingComponent } from "./components/packages/mapping/mapping.component";
import { MessageslistComponent } from "./components/settings/messageslist/messageslist.component";
import { PlatformsettingsComponent } from "./components/settings/platformsettings/platformsettings.component";
import { EmailtemplateComponent } from "./components/templates/emailtemplate/emailtemplate.component";
import { BannergroupComponent } from "./components/assetmanagement/bannergroup/bannergroup.component";
import { AddBannergroupComponent } from "./components/assetmanagement/bannergroup/add-bannergroup/add-bannergroup.component";
import { BannerComponent } from "./components/assetmanagement/banner/banner.component";

import { ManageBannerComponent } from "./components/assetmanagement/bannergroup/manage-banner/manage-banner.component";
import { AddBannerComponent } from "./components/assetmanagement/banner/add-banner/add-banner.component";
import { MultialertComponent } from "./components/masters/multialert/multialert.component";
import { PageListComponent } from "./components/pagemanagement/page-list/page-list.component";
import { ModuleListComponent } from "./components/pagemanagement/module-list/module-list.component";
import { ReportsListComponent } from "./components/reports/reports-list/reports-list.component";
import { CcareIndexComponent } from "./components/customercare/ccare-index/ccare-index.component";
import { PublishComponent } from "./components/publish/publish.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PageManagementComponent } from "./components/pagemanagement/page-management.component";
import { TranslationsComponent } from "./components/settings/translations/translations.component";
import { Error400Component } from "./components/shared/error400/error400.component";
import { Error403Component } from "./components/shared/error403/error403.component";
import { Error405Component } from "./components/shared/error405/error405.component";
import { SpecialconfigComponent } from "./components/packages/specialconfig/specialconfig.component";
import { SegmentsComponent } from "./components/masters/segments/segments.component";
import { FourgcitiesComponent } from "./components/masters/fourgcities/fourgcities.component";
import { PopularpackagesComponent } from "./components/packages/popularpackages/popularpackages.component";

import { MasterassetsComponent } from "./components/assetmanagement/masterassets/masterassets.component";
import { SpinsegmentComponent } from "./components/spinthewheel/spinsegment/spinsegment.component";
import { SpinpackmasterComponent } from "./components/spinthewheel/spinpackmaster/spinpackmaster.component";

import { GatewayipsComponent } from "./components/masters/gatewayips/gatewayips.component";
import { VouchersComponent } from "./components/spinthewheel/vouchers/vouchers.component";
import { RefreshComponent } from "./components/settings/refresh/refresh.component";
import { AuditlogsComponent } from "./components/auditlogs/auditlogs.component";
import { AppratingComponent } from "./components/reports/apprating/apprating.component";
import { ProfileComponent } from "./components/customercare/profile/profile.component";
import { WhitelistsegmentsComponent } from "./components/masters/whitelistsegments/whitelistsegments.component";
import { ReportsinboxComponent } from "./components/reports/reportsinbox/reportsinbox.component";
import { VoceEventsComponent } from "./components/Voce/voce-events/voce-events.component";
import { VoceMasterComponent } from "./components/Voce/voce-master/voce-master.component";
import { VoceQuestionsComponent } from "./components/Voce/voce-questions/voce-questions.component";
import { AddVoceMasterComponent } from "./components/Voce/voce-master/add-voce-master/add-voce-master.component";
import { AddVoceQuestionsComponent } from "./components/Voce/voce-questions/add-voce-questions/add-voce-questions.component";
import { VoceOptionsComponent } from "./components/Voce/voce-options/voce-options.component";
import { AddVoceOptionsComponent } from "./components/Voce/voce-options/add-voce-options/add-voce-options.component";
import { RssMasterComponent } from "./components/RSS/rss-master/rss-master.component";
import { RssDataListComponent } from "./components/RSS/rss-data-list/rss-data-list.component";
import { ProtipalertsComponent } from "./components/protipalerts/protipalerts.component";
import { CircleListComponent } from "./components/circle/circle-list/circle-list.component";
import { BundlesListComponent } from "./components/bundles/bundles-list/bundles-list.component";
import { ValidationRulesListComponent } from "./components/validation-rules/validation-rules-list/validation-rules-list.component";
import { PackagesListComponent } from "./components/circle/packages/packages-list/packages-list.component";
import { PaymentTransactionsComponent } from "./components/customercare/payment-transactions/payment-transactions.component";
import { TransactionstatusComponent } from './components/customercare/payment-transactions/transactionstatus/transactionstatus.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import { EncryptdeeplinkComponent } from './encryptdeeplink/encryptdeeplink.component';
import { EventBasedPushNotificationsComponent } from "./components/event-based-push-notifications/event-based-push-notifications.component";


const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "spinrules",
        component: SpinrulesComponent,
      },
      {
        path:"notifications",
        component:NotificationsComponent

      },
      {
        path:"eventnotifications",
        component:EventBasedPushNotificationsComponent

      },
      {
        path:"encryptdeeplink",
        component:EncryptdeeplinkComponent
      },
      {
        path: "error403",
        component: Error403Component,
      },
      {
        path: "error400",
        component: Error400Component,
      },
      {
        path: "error405",
        component: Error405Component,
      },
      {
        path: "userslist",
        component: UserslistComponent,
      },
      {
        path: "managerights",
        component: ManageRightsComponent,
      },
      {
        path: "managerights/:id",
        component: ManageRightsComponent,
      },
      {
        path: "myprofile",
        component: MyprofileComponent,
      },
      {
        path: "offerpacks",
        component: OfferPacksComponent,
      },
      {
        path: "channels",
        component: ChannelsComponent,
      },
      {
        path: "attributes",
        component: AttributesComponent,
      },
      {
        path: "rules",
        component: RulesComponent,
      },
      {
        path: "categories",
        component: CategoriesComponent,
      },
      {
        path: "packages",
        component: PackagelistComponent,
      },
      {
        path: "packagedef",
        component: PackagedefComponent,
      },
      {
        path: "addpackage",
        component: AddPackagelistComponent,
      },
      {
        path: "mapping",
        component: MappingComponent,
      },
      {
        path: "messageslist",
        component: MessageslistComponent,
      },
      {
        path: "globalsettings",
        component: PlatformsettingsComponent,
      },
      {
        path: "template",
        component: EmailtemplateComponent,
      },
      {
        path: "bannergrouping",
        component: BannergroupComponent,
      },
      {
        path: "banner",
        component: BannerComponent,
      },
      {
        path: "addbanner",
        component: AddBannerComponent,
      },
      {
        path: "addbanner/:id/:type/:isview",
        component: AddBannerComponent,
      },
      {
        path: "managebanners/:bgid",
        component: ManageBannerComponent,
      },
      {
        path: "multialerts",
        component: MultialertComponent,
      },
      {
        path: "pages",
        component: PageListComponent,
      },
      {
        path: "reports",
        component: ReportsListComponent,
      },
      {
        path: "modules/:id/:name",
        component: ModuleListComponent,
      },
      {
        path: "ccare",
        component: CcareIndexComponent,
      },
      {
        path: "publish",
        component: PublishComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "page",
        component: PageManagementComponent,
      },
      {
        path: "translations",
        component: TranslationsComponent,
      },
      {
        path: "specialpkgconfig",
        component: SpecialconfigComponent,
      },
      {
        path: "segments",
        component: SegmentsComponent,
      },
      {
        path: "4gcities",
        component: FourgcitiesComponent,
      },
      {
        path: "popularpacks",
        component: PopularpackagesComponent,
      },
      {
        path: "masterassets",
        component: MasterassetsComponent,
      },
      {
        path: "spinsegments",
        component: SpinsegmentComponent,
      },
      {
        path: "spinvouchers",
        component: VouchersComponent,
      },
      {
        path: "spinoffers",
        component: SpinpackmasterComponent,
      },
      {
        path: "gatewayips",
        component: GatewayipsComponent,
      },
      {
        path: "addbannergroup",
        component: AddBannergroupComponent,
      },
      {
        path: "addbannergroup/:id",
        component: AddBannergroupComponent,
      },
      {
        path: "refresh",
        component: RefreshComponent,
      },
      {
        path: "auditlogs",
        component: AuditlogsComponent,
      },
      {
        path: "apprating",
        component: AppratingComponent,
      },
      {
        path: "profileinfo",
        component: ProfileComponent,
      },
      //Added for #Jira id:DIGITAL-3211
      {
        path: "whitelistsegments",
        component: WhitelistsegmentsComponent,
      },
      //Added for #Jira id:DIGITAL-3447
      {
        path: "reportsinbox",
        component: ReportsinboxComponent,
      },
      //Added for #Jira Id:DIGITAL-4648
      {
        path: "voceevents",
        component: VoceEventsComponent,
      },
      {
        path: "vocemaster",
        component: VoceMasterComponent,
      },
      {
        path: "vocequestions/:voceid",
        component: VoceQuestionsComponent,
      },
      { path: "addvoice/:id", component: AddVoceMasterComponent },
      {
        path: "addvoice",
        component: AddVoceMasterComponent,
      },
      {
        path: "addvoicequestions/:voceid/:id",
        component: AddVoceQuestionsComponent,
      },
      {
        path: "addvoicequestions",
        component: AddVoceQuestionsComponent,
      },
      {
        path: "voceoptions/:qid/:voceid/:type",
        component: VoceOptionsComponent,
      },
      {
        path: "addvoiceoptions/:qid/:voceid/:type/:optid",
        component: AddVoceOptionsComponent,
      },
      //Added for #Jira Id:DIGITAL-5568
      {
        path: "rssmaster",
        component: RssMasterComponent,
      },
      {
        path: "rssdata/:id",
        component: RssDataListComponent,
      },
      //Added for #Jira Id:DIGITAL-5798
      {
        path: "protip",
        component: ProtipalertsComponent,
      },
      //Added for #Jira Id:DIGITAL-6321
      {
        path: "circles",
        component: CircleListComponent,
      },
      {
        path: "bundles",
        component: BundlesListComponent,
      },
      {
        path: "validation-rules",
        component: ValidationRulesListComponent,
      },
      {
        path: "packagelist",
        component: PackagesListComponent,
      },
      //Jira ID:DIGITAL-6978
      {
        path: "paymenttransactions",
        component: PaymentTransactionsComponent,
      },
      {
        path: "transactionstatus/:tid/:usertype", 
        component: TransactionstatusComponent
      },
      {
        path: "transactionstatus", 
        component: TransactionstatusComponent
      }   
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {
  constructor(router: Router) {
    console.log("Router");
  }
}
