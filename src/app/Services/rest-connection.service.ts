import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestConnectionService {
  sessionData:any;
  urlForSession: any;
  urlParameter: any;
  message: any;


  constructor(private  http: HttpClient) {  }

  authenticate = true;

  // function;
  // changeMessage(message: any) {
  //   this.messageSource.next(message);
  // }
  getUsers(userCredentials, authenticated) {

    const url = 'http://127.0.0.1:8060/user';
    const headers = new HttpHeaders(userCredentials ? {
      authorization : 'Basic ' + btoa(userCredentials.userName + ':' + userCredentials.password)
    } : {});

    return this.http.get(url, {headers: headers})
      .pipe(map(data => data));
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
