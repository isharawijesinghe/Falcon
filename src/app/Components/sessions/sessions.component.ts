import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ShareSessionDataService} from "../../Services/share-session-data.service";
import {HttpClient} from "@angular/common/http";
import { Chart } from 'chart.js';


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
  graphDataCurrent = [];
  chart = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private restConnectionService : RestConnectionService, public sharedData:ShareSessionDataService, private  http: HttpClient) {
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
    this.restConnectionService.getServices();

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
    this.graphDataCurrent = [];

    // this.restConnectionService.getCurrentSessionDetalis(row.sessionId);
    // this.currentSessionData = this.restConnectionService.getCurrentSessionDetalis(row.sessionId);

    this.http.get('http://localhost:8060/watchdogclient/messages/graph?sessionId='+ row.sessionId).subscribe((data) => {
      // this.sharedData.setSessionData(data);
      this.currentSessionData = data;
      console.log(this.currentSessionData);

      this.serviceData = this.sharedData.getServiceData();
      console.log(this.serviceData);

      if(this.currentSessionData!=''){
        Object.keys(this.currentSessionData).forEach((key)=>{
          let serviceName = this.findService(key);
          if(serviceName != ''){
            this.graphDataCurrent[serviceName.toString()] = this.currentSessionData[key];
          }
        });
      }else{
        console.log('No session data available');
      }
      // console.log(Object.keys(this.graphDataCurrent));
      // console.log(Object.values(this.graphDataCurrent));

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

      // this.serviceData.forEach(function (element) {
      //   this.serviceDataList.push(element);
      //   console.log(element);
      // });

    });

    // console.log(this.currentSessionData+'*****');


  }

  sessionDetailClose(){
    this.isPoppingup = false;
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

