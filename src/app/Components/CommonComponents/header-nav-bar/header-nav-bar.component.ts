import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../Services/auth.service";
import {Router} from "@angular/router";
import {PopupService} from '../../../Services/login-popup-service.service';
import {LoginComponent} from "../../login/login.component";



@Component({
  selector: 'app-header-nav-bar',
  templateUrl: './header-nav-bar.component.html',
  styleUrls: ['./header-nav-bar.component.css']
})

export class HeaderNavBarComponent implements OnInit {
  id: String;

  isLogged: boolean;

  constructor(private router: Router,public authService: AuthService, private popup: PopupService) {

  }

  ngOnInit() {

  }

  getLogStatus():boolean{
    this.id = atob(sessionStorage.getItem('token')).split(":",2)[0];
    if(sessionStorage.getItem('isLoggedIn')==="true"){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
    return this.isLogged;
  }

  logout(): void {
    console.log("Logout");
    this.authService.logout();
    this.router.navigate(['/dashboard']);
    // window.location.reload();
    // this.popup.modal();
  }
  login(): void {
    console.log("Login");
    // this.router.navigate(['/login']);
    if(!this.popup.currentlyLoaded){
      this.popup.modal(LoginComponent);
    }
  }
}
