import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HttpClient} from "@angular/common/http";
import { Chart } from 'chart.js';
import {Router} from "@angular/router";



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
  serviceData:any;
  serviceDataList:any;
  isGraphDataNull:any;
  showAllMessagesWaiting:any;
  hideViewAllButton:any;
  showAllMessagesError:any;
  showSpecificMessages:any;
  channel:any;
  messages = [];
  tenantCode:any;
  graphDataCurrent = [];
  chart = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private restConnectionService : RestConnectionService, private  http: HttpClient, private router:Router) {
  }

  ngOnInit() {
    this.isPoppingup = false;
    this.isLoading=true;
    this.showAllMessagesWaiting = false;
    this.hideViewAllButton = false;
    this.showAllMessagesError = false;
    this.showSpecificMessages = false;

    this.restConnectionService.getSessions().subscribe(data => {
      this.Sessiondata = data;

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
    this.restConnectionService.getServices().subscribe((data)=>{
      this.serviceData = data['services'];
    });

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
    this.isGraphDataNull = false;
    this.graphDataCurrent = [];

    this.restConnectionService.getCurrentSessionDetalis(this.sessionID).subscribe((data) => {
      this.currentSessionData = data;
      console.log(this.currentSessionData);

      if(Object.keys(this.currentSessionData).length!=0){
        this.hideViewAllButton = true;
      }

      Object.keys(this.currentSessionData).forEach((key)=>{
        let serviceName = this.findService(key);
        if(serviceName != null){
          this.graphDataCurrent[serviceName.toString()] = this.currentSessionData[key];
        }
      });

      if(Object.values(this.graphDataCurrent).length==0){
        this.isGraphDataNull = true;
      }else{
        this.isGraphDataNull = false;
      }

      let defaultColors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC'];
      this.chart = new Chart('canvas', {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.graphDataCurrent),
          datasets: [
            {
              data: Object.values(this.graphDataCurrent),
              borderColor: 'transparent',
              backgroundColor: defaultColors,
              fill: false
            }
          ]
        },
        options: {
          title: {
            display: true,
            fontSize: 10,
            position: 'top',
            text: 'Message Distribution w.r.t. Services.'
          },
          legend: {
            position: 'top',
            display: true,
            fontSize: 8
          },
          tooltips: {
            enabled : true
          },
          hover: {
            mode: null
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    });

  }

  sessionDetailClose(){
    this.isPoppingup = false;
    this.hideViewAllButton = false;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  findService(key: string) {
    let result = '';
    this.serviceData.forEach((service)=>{
      if(service['id'] == key){
        result = service['serviceName'];
      }
    });
    return result;
  }

  viewAllMessages(){
    if(Object.keys(this.currentSessionData).length != 0) {
      this.isPoppingup = false;
      this.showAllMessagesWaiting = true;

      this.restConnectionService.getSpecificMessages(this.sessionID).subscribe((messages)=>{
        console.log(messages);

        if(Object.keys(messages).length!=0){
          this.channel = messages[0]['channel'];
          this.tenantCode = messages[0]['tenantCode'];
        }
        Object.values(messages).forEach((message)=>{
          message['date'] = parseDates(message['date']);
          this.messages.push(message);
        });

      },(err:any)=>{
        this.showAllMessagesWaiting = false;
        this.showAllMessagesError = true;
      },()=>{
        this.showAllMessagesWaiting = false;
        // this.showSpecificMessages = true;
        this.router.navigate(['/specificmessages']);
      });
    }
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

function parseDates(date) {
  var parsedDate = new Date(date);
  return parsedDate.getDate() + "-" + (parsedDate.getMonth() + 1) + "-" + parsedDate. getFullYear()
    + " " + parsedDate.getHours() + ":" + parsedDate.getMinutes() + ":" + parsedDate.getSeconds();
}

