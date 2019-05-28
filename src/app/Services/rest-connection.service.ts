import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {PopupService} from "./login-popup-service.service";

@Injectable({
  providedIn: 'root'
})
export class RestConnectionService {
  sessionData:any;
  urlForSession: any;
  urlParameter: any;
  message: any;


  constructor(private  http: HttpClient, private router: Router, private popup : PopupService) {  }

  authenticate = true;

  // function;
  // changeMessage(message: any) {
  //   this.messageSource.next(message);
  // }
  login(username, password) {
    let url = 'http://localhost:8060/login';
    this.http.post<Observable<boolean>>(url, {
      userName: username,
      password: password
    }).subscribe(isValid => {
      if (isValid) {
        sessionStorage.setItem('token', btoa(username + ':' + password));
        sessionStorage.setItem('isLoggedIn',"true");
        // console.log(atob(sessionStorage.getItem('token')).split(":",2)[0]);
        this.router.navigate(['']);
        // localStorage.setItem("isLoggedIn","true");
        this.popup.close();
      } else {
        alert("Authentication failed.")
      }
    });
  }

  firstclick() { // test method
    return console.log(' service clicked ');
  }

  getWebsocketStatus() {
    return this.http.get('http://localhost:8060/resource');
  }

  getWatchdogclientManageview() {
    return this.http.get('/watchdogclient/eod/start/');
  }


  getSessions() {
    return this.http.get('http://localhost:8060/watchdogclient/sessions/active');
  }

  getSLAMessage(){
    return this.http.get('http://localhost:8060/watchdogclient/messages/sla');
  }

  getViewInfo(){
    return this.http.get('http://localhost:8060/watchdogclient/view');
  }

  // get client request details

  getRoutesDetails(clientID){
    return this.http.get('http://localhost:8060/watchdogclient/route/' + clientID);
  }

  getRoutesHistoryDetails(clientIdHistory){
    return this.http.get('http://localhost:8060/watchdogclient/route/history/' + clientIdHistory);
  }

  getAllRoutes(){
    return this.http.get('http://localhost:8060/watchdogclient/route/all/');
  }

  getCurrentSessionDetalis(sessionId){
    return this.http.get('http://localhost:8060/watchdogclient/messages/graph?sessionId='+ sessionId);
  }

  getServices(){
    return this.http.get('http://localhost:8060/watchdogclient/services');
  }

  getclientCountMap(){
    return this.http.get('http://localhost:8060/watchdogclient/clientCountMap');
  }

  getSpecificMessages(sessionId){
    return this.http.get('http://localhost:8060/watchdogclient/messages/specific?sessionId='+sessionId);
  }

  getSpecificResponses(uId){
    return this.http.get('http://localhost:8060/watchdogclient/responses/specific?uid='+uId);
  }

  getSlaMapRoundTime(){
    return this.http.get('http://localhost:8060/watchdogclient/slaconfigroundtime');
  }
  getSlaMapDefaultTime(){
    return this.http.get('http://localhost:8060/watchdogclient/slaconfigdefaulttime');
  }

  getSlaServices(){
    return this.http.get('http://localhost:8060/watchdogclient/slaconfigservice')
  }

  // service for specific message

  // fetchSpecificMessages() {
  //   // this.currentSession = this.currentMessage.subscribe(message => this.message = message);
  //   // console.log(this.currentSession['sessionId']);
  //   // this.urlParameter = JSON.stringify(this.currentSession['sessionId']);
  //   // console.log(this.urlParameter);
  //   // this.urlForSession = 'http://localhost:8060/watchdogclient/responses/specific?sessionId=';
  //   // this.urlForSession = this.urlForSession.concat(this.urlParameter);
  //   // return this.http.get(this.urlForSession);
  // }
}
