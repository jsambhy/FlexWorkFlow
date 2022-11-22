import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DirectAccessGuard implements CanActivate {
  isAssigned: boolean;

  constructor(private router: Router) { }
  

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   

    // If the previous URL was blank, then the user is directly accessing this page
    let RoleMenuList = (sessionStorage.getItem('RoleMenuList').toString());
    
    let IsAuth = (sessionStorage.getItem('IsAuth'));

    //Match the new url wether it exist in RoleMenuList or not
    this.isAssigned = RoleMenuList.includes(state.url);
    if (this.isAssigned)//If LoggedInRole has access on that url
    {
      return true;
    }
    else if (this.router.url == state.url)//if old and new url same including parameters then also return true
    {
      return true;
    }
    else if (IsAuth == "true")
    {
       //handle those case which are not in RoleMenuList and User is navigating internally and also have access
      sessionStorage.setItem("IsAuth", "false");
      return true;
    }
    else if (this.router.url == "/") //This will happen only in case refresh of those urls which do not exist in RoleMenuList
    {
      return true;
    }
    else {
      return false;
    }
  }



}
