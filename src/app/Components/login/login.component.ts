import {Component, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {Login} from "../../login";
import {Router} from "@angular/router";
import {AuthService} from "../../Services/auth.service";
import {PopupService} from '../../Services/login-popup-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: Login = { username: "admin", password: "123" };
  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  hashedpwd:any;


  constructor(private formBuilder: FormBuilder,private router: Router, public authService: AuthService, private popup:PopupService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/dashboard';
    this.authService.logout();
  }

  get f() { return this.loginForm.controls; }


  login() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }else{




      if(this.f.username.value == this.model.username && this.f.password.value == this.model.password){
        console.log("Logged in successful");
        //this.authService.authLogin(this.model);
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('token', this.f.username.value);
        this.router.navigate([this.returnUrl]);
        this.popup.close();
        // window.location.reload();
      }
      else{
        this.message = "Please check your Username and password";
      }
    }
  }

}
