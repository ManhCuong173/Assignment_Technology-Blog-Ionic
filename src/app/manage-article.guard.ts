import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ManageArticleGuard implements CanActivate
{
  constructor(private __loginService: LoginService, private __router: Router)
  { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this.__loginService.getUser().role == 'CA' || this.__loginService.getUser().role == 'AD') return true;
    else this.__router.navigate(['/signin'])
  }



}
