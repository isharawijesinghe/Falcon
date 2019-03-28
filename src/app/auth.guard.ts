import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {PopupService} from './Services/login-popup-service.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router : Router, private popup:PopupService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.verifyLogin(url);
  }

  verifyLogin(url) : boolean{
    if(!this.isLoggedIn()){
      // this.router.navigate(['/login']);
      if(!this.popup.currentlyLoaded){
        this.popup.modal();
      }

      return false;
    }
    else if(this.isLoggedIn()){
      return true;
    }
  }
  public isLoggedIn(): boolean{
    let status = false;
    if( localStorage.getItem('isLoggedIn') == "true"){
      status = true;
    }
    else{
      status = false;
    }
    return status;
  }
}
