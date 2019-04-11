import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {PopupService} from "../../Services/login-popup-service.service";
import {SessionPopupComponent} from "../session-popup/session-popup.component";



@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  Sessiondata: any;
  currentSessionData:any;
  isLoading: any;
  displayedColumns = ['clientChannel', 'clientIp', 'startTime', 'loginId', 'upTime', 'sessionId', 'status'];
  dataSource: MatTableDataSource<SessionData>;
  isPoppingUp: boolean;
  clientChannel:any;
  clientIP:any;
  loginID:any;
  upTime:any;
  sessionID:any;
  startTime:any;
  serviceData:any;
  serviceDataList:any;
  isGraphDataNull:any;
  showAllMessagesWaiting:any;
  hideViewAllButton:any;
  showAllMessagesError:any;
  showSpecificMessages:any;
  channel:any;
  clickedRow:any;
  messages = [];
  tenantCode:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private restConnectionService : RestConnectionService, private  http: HttpClient, private router:Router, private popup:PopupService) {
  }

  ngOnInit() {
    this.isPoppingUp = false;
    this.isLoading=true;
    this.showAllMessagesWaiting = false;
    this.hideViewAllButton = false;
    this.showAllMessagesError = false;
    this.showSpecificMessages = false;

    this.restConnectionService.getSessions().subscribe(data => {
      this.Sessiondata = data;
      this.popup.dataService1 = this.Sessiondata;

      const sessiondata: SessionData[] = [];
      console.log(this.Sessiondata);
      for(let sessionData of this.Sessiondata){
        sessiondata.push(createNewSessionData(sessionData));
      }
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(sessiondata);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
    },
    error => this.isLoading = false
    );


  }


  getSessionDetails(row:any){
    console.log(row.sessionId);
    this.clickedRow = row;
    this.popup.dataService2 = this.clickedRow;
    this.isPoppingUp = true;
    if(!this.popup.currentlyLoaded){
      this.popup.modal(SessionPopupComponent);
    }
  }

  // sessionDetailClose(){
  //   this.isPoppingUp = false;
  //   this.hideViewAllButton = false;
  // }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  errorMessageClose(){
    this.showAllMessagesError = false;
  }

  backToSession(){
    this.showSpecificMessages = false;
    this.hideViewAllButton = false;
    this.messages = [];
  }

}

export interface SessionData {
  clientChannel: string
  clientIp: string;
  startTime: string;
  loginId: string;
  upTime: string;
  sessionId: string;
  status: string;
}

function createNewSessionData(sessionData: any):SessionData {
  return {
    clientChannel: sessionData['clientChannel'],
    clientIp: sessionData['clientIp'],
    startTime: sessionData['startTime'],
    loginId: sessionData['loginId'],
    upTime: sessionData['upTime'],
    sessionId: sessionData['sessionId'],
    status: sessionData['status']
  };
}


