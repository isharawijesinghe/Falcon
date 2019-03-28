import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';



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
  isPoppingup: boolean;
  clientChannel:any;
  clientIP:any;
  loginID:any;
  upTime:any;
  sessionID:any;
  startTime:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private restConnectionService : RestConnectionService) {
  }

  ngOnInit() {
    this.isPoppingup = false;
    this.isLoading=true;
    this.restConnectionService.getSessions().subscribe(data => {
      this.Sessiondata = data;

      const sessiondata: SessionData[] = [];
      console.log(this.Sessiondata);
      for(let sessionData of this.Sessiondata){
        sessiondata.push(createNewSessionData(sessionData));
      }
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(sessiondata);
      // console.log(this.dataSource);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    },
    error => this.isLoading = false
    );

  }

  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

  }

  getSessionDetails(row:any){
    console.log(row.sessionId);
    this.isPoppingup = true;
    this.clientChannel = row.clientChannel;
    this.clientIP = row.clientIp;
    this.loginID = row.loginId;
    this.upTime = row.upTime;
    this.sessionID = row.sessionId;
    this.startTime = row.startTime;
    // return this.isPoppingup;
    // this.currentSessionData = this.restConnectionService.getCurrentSessionDetalis(sessionId);
    // console.log(JSON.stringify(this.currentSessionData));
  }

  sessionDetailClose(){
    this.isPoppingup = false;
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
