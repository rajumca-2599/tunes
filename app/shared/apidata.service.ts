import { Injectable, Output } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IMIapiService } from './imiapi.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { Subject } from 'rxjs';
export interface CacheEntry {
  result: any;
  entryTime: number;
}
@Injectable({
  providedIn: 'root',
})
export class ApidataService {
  constructor(
    private http: HttpClient,
    private imiapi: IMIapiService,
    private env: EnvService
  ) {}
  public responseCache = new Map();
  isExipired: boolean;
  cacheEntry: CacheEntry;
  dbtimecache: any;
  dbrespcache: any;
  splpackagecache: any;
  footerstateName = new Subject<String>(); 
  deactivateresp=new Subject<String>();
  public getDashboardData1(): Observable<any> {
    const dashboardFromCache = this.responseCache.get('dashboardResp');
    if (dashboardFromCache && dashboardFromCache.status == '0') {
      return of(dashboardFromCache);
    }
    const response = this.imiapi.postData('v1/dashboard/get/v2', {});
    response.subscribe((data) =>
      this.responseCache.set('dashboardResp', response)
    );
    return response;
  }

  public getDashboardData2(): Observable<any> {
    this.isExipired = true;
    const cacheEntry = this.responseCache.get('dashboardResp');
    this.imiapi.log('getDashboardData--' + this.cacheEntry);
    if (this.cacheEntry != undefined && this.cacheEntry != null) {
      this.imiapi.log('DBExistInCache');
      this.imiapi.log(
        (Date.now() - this.cacheEntry.entryTime).toString() +
          '|' +
          this.env.dashboardresp_max_cache_limit
      );
      if (
        !(
          Date.now() - this.cacheEntry.entryTime >=
          this.env.dashboardresp_max_cache_limit
        )
      )
        this.isExipired = false;
    }
    this.imiapi.log('getDashboardData--Expired' + this.isExipired);
    if (!this.isExipired) {
      this.imiapi.log('DB returning from Cache.');
      return of(this.cacheEntry.result);
    }

    const response = this.imiapi.postData('v1/dashboard/get/v2', {});
    response.subscribe((data) => {
      const entry: CacheEntry = { result: response, entryTime: Date.now() };
      if (this.responseCache.has('dashboardResp'))
        this.responseCache.delete('dashboardResp');

      this.responseCache.set('dashboardResp', entry);
    });
    return response;
  }

  private deleteExpiredCache() {
    this.responseCache.forEach((entry) => {
      if (
        Date.now() - entry.entryTime >
        this.env.dashboardresp_max_cache_limit
      ) {
        this.responseCache.delete('dashboardResp');
      }
    });
  }

  public getDashboardResp(skipcache: boolean): Observable<any> {
    const now = new Date();
    /* try { */
    // const cacheexpiry = now.getTime() + this.env.apicache;
    let doreq: boolean = true;
    if (!skipcache) {
      this.imiapi.log('dbcachetime:' + this.imiapi.getStorage('dashboard_ct'));
      this.dbtimecache = this.imiapi.getStorage('dashboard_ct');
      if (
        !(
          this.dbtimecache == null ||
          this.dbtimecache == 'NA' ||
          this.dbtimecache == undefined
        )
      ) {
        this.imiapi.log(
          'Time:' + now.getTime() + '|' + this.imiapi.getStorage('dashboard_ct')
        );
        if (now.getTime() < Number(this.imiapi.getStorage('dashboard_ct'))) {
          this.imiapi.log(' DB From Cache');
          this.dbrespcache = this.imiapi.getStorage('dashboard');
          if (
            !(
              this.dbrespcache == undefined ||
              this.dbrespcache == '' ||
              this.dbrespcache == 'NA'
            )
          ) {
            doreq = false;
            return of(JSON.parse(this.dbrespcache));
          }
        }
      }
    }
    //if (doreq) {
    this.imiapi.log('doreq:' + doreq);
    const response: any = this.imiapi.postData('v1/dashboard/get/v2', {});
    response.subscribe((data) => {
      this.imiapi.log('DBResp1:' + data);
      if (data.status == '0') {
        this.imiapi.log('CacheExpiry:' + now.getTime() + this.env.apicache);
        this.imiapi.setStorage('dashboard', data);
        this.imiapi.setStorageValue(
          'dashboard_ct',
          now.getTime() + this.env.apicache
        );
      }
    });
    return response;
  }

  public getSpecialPackages(skipcache: boolean): Observable<any> {
    const now = new Date();
    /* try { */
    // const cacheexpiry = now.getTime() + this.env.apicache;
    let doreq: boolean = true;
    let splcachetime: any;
    if (!skipcache) {
      // this.imiapi.log("splpackage_ct:" + this.imiapi.getStorage("splpackage_ct"));
      splcachetime = this.imiapi.getStorage('splpackage_ct');
      if (
        !(
          splcachetime == null ||
          splcachetime == 'NA' ||
          splcachetime == undefined
        )
      ) {
        this.imiapi.log(
          'Spl CTime|ETime:' +
            now.getTime() +
            '|' +
            this.imiapi.getStorage('splpackage_ct')
        );
        if (now.getTime() < Number(this.imiapi.getStorage('splpackage_ct'))) {
          this.splpackagecache = this.imiapi.getStorage('splpackage');
          if (
            !(
              this.splpackagecache == undefined ||
              this.splpackagecache == '' ||
              this.splpackagecache == 'NA'
            )
          ) {
            this.imiapi.log('splpackage4Cache');
            doreq = false;
            return of(JSON.parse(this.splpackagecache));
          }
        }
      }
    }
    //if (doreq) {
    this.imiapi.log('doreq:' + doreq);
    const response: any = this.imiapi.postData(
      'v1/packages/getspecialpackages',
      {}
    );
    response.subscribe((data) => {
      // this.imiapi.log("SplReq:" + data);
      if (data.status == '0') {
        // this.imiapi.log("SplCacheExpiry:" + now.getTime() + this.env.apicache);
        this.imiapi.setStorage('splpackage', data);
        this.imiapi.setStorageValue(
          'splpackage_ct',
          now.getTime() + this.env.apicache
        );
      }
    });
    return response;
  }

}
