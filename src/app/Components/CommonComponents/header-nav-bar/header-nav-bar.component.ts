import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth.service";
import {Router} from "@angular/router";
import {PopupService} from '../../../Services/popup-service.service';


@Component({
  selector: 'app-header-nav-bar',
  templateUrl: './header-nav-bar.component.html',
  styleUrls: ['./header-nav-bar.component.css']
})

export class HeaderNavBarComponent implements OnInit {
  id: String;

  @Input() isLogged: boolean;

  constructor(private router: Router,public authService: AuthService, private popup: PopupService) {
    this.id = localStorage.getItem('token');

    if(localStorage.getItem('isLoggedIn')==="true"){
      this.isLogged = true;
    }
  }

  ngOnInit() {
  }

  logout(): void {
    console.log("Logout");
    this.authService.logout();
    this.router.navigate(['/login']);
    // this.popup.modal();
  }
  login(): void {
    console.log("Login");
    // this.router.navigate(['/login']);
    this.popup.modal();
  }
}
