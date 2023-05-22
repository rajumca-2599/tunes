import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { IMIapiService } from './imiapi.service';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class LoginguardService implements CanActivate {
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree {
    if (
      this.imiapi.getSession('token') == '' ||
      this.imiapi.getSession('token') == 'NA'
    ) {
      return true;
    } else {
      let tokenId = this.imiapi.getSession('token');
      let pvrcode = this.imiapi.getSession('pvrcode');
      console.log(pvrcode);
      let catgId = this.imiapi.getSession('catgId');
      console.log(catgId);
      if (pvrcode != undefined && pvrcode != 'NA' && pvrcode != '') {
        this.imiapi.setSession('navigationfrom', 'home');
        this.imiapi.OcwRedirection('viewpackage', tokenId, '2', false);
        return;
      }
      else if (catgId != undefined && catgId != 'NA' && catgId != '') {
        this.imiapi.setSession('navigationfrom', 'home');
        this.imiapi.OcwRedirection('category', tokenId, '2', false);
        return;
      }
     else return this.router.createUrlTree(['/home']);
    }
  }
}
