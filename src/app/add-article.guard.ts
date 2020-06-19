import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AddArticleGuard implements CanActivate
{
  constructor(private __logicService: LoginService, private __router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    //logic
    if (this.__logicService.user.email == 'daomanhcuong173@gmail.com') {
      return true
    }
    else {
      this.__router.navigate(['homepage'])
      return false;
    }
  }

}
