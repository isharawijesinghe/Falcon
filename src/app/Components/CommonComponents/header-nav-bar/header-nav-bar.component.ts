import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header-nav-bar',
  templateUrl: './header-nav-bar.component.html',
  styleUrls: ['./header-nav-bar.component.css']
})
export class HeaderNavBarComponent implements OnInit {
  id: String;
  isLogged: boolean;

  constructor(private router: Router,public authService: AuthService) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
    if(localStorage.getItem('isLoggedIn')==="true"){
      this.isLogged = true;
    }
  }
  logout(): void {
    console.log("Logout");
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
