import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { IMIapiService } from './imiapi.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardService implements CanActivate {
  constructor(private imiapi: IMIapiService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree {
    var url = location.href;
    if (
      this.imiapi.getSession('token') != '' &&
      this.imiapi.getSession('token') != 'NA'
    ) {
      if (
        (url.includes('?') && window.location.hash.indexOf('category') > 0) ||
        (url.includes('?') && window.location.hash.indexOf('package') > 0)
      ) {
        this.storeCatgOrPvrCode();
        return this.router.createUrlTree(['/pwa']);        
      }
      return true;
    } else {
      if (
        (url.includes('?') && window.location.hash.indexOf('category') > 0) ||
        (url.includes('?') && window.location.hash.indexOf('package') > 0)
      ) {
        this.storeCatgOrPvrCode();
        return this.router.createUrlTree(['/pwa']);
      } else {
        return this.router.createUrlTree(['/login']);
      }
    }
  }
  storeCatgOrPvrCode() {
    try {
      const path = window.location.hash;
      console.log(path);
      this.imiapi.removeSession('catgId');
      this.imiapi.removeSession('pvrcode');
      if (path.indexOf('category') > 0) {
        const catgId = path.split('=')[1];
        this.imiapi.setSession('catgId', catgId);
      }
      if (path.indexOf('package') > 0) {
        const pkgCode = path.split('=')[1];
        this.imiapi.setSession('pvrcode', pkgCode);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
