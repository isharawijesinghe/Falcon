import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {RestConnectionService} from "../../Services/rest-connection.service";
import { Chart } from 'chart.js';
import {PopupService} from "../../Services/login-popup-service.service";
import {SessionsComponent} from "../sessions/sessions.component";


@Component({
  selector: 'app-session-popup',
  templateUrl: './session-popup.component.html',
  styleUrls: ['./session-popup.component.css']
})
export class SessionPopupComponent implements OnInit {

  clickedRow:any;
  Sessiondata:any;
  serviceData:any;

  constructor(private router:Router ,private restConnectionService:RestConnectionService, private popup: PopupService) {
    if(popup.dataService2 !=undefined && popup.dataService1!=undefined){
      this.clickedRow = popup.dataService2;
      this.Sessiondata = popup.dataService1;
    }
  }

  clientChannel:any;
  clientIP:any;
  loginID:any;
  upTime:any;
  sessionID:any;
  startTime:any;
  isGraphDataNull:any;
  graphDataCurrent:any;
  currentSessionData:any;
  hideViewAllButton:any;
  showAllMessagesWaiting:any;
  showAllMessagesError:any;
  messages = [];
  chart = [];

  ngOnInit() {

    this.restConnectionService.getServices().subscribe((data)=>{
      this.serviceData = data['services'];
    },(err:any)=>{
      console.log('error:'+err);
    },()=>{
      this.clientChannel = this.clickedRow.clientChannel;
      this.clientIP = this.clickedRow.clientIp;
      this.loginID = this.clickedRow.loginId;
      this.upTime = this.clickedRow.upTime;
      this.sessionID = this.clickedRow.sessionId;
      this.startTime = this.clickedRow.startTime;
      this.isGraphDataNull = false;
      this.graphDataCurrent = [];

      this.getSessionDetails();
    });


  }

  getSessionDetails(){


    this.restConnectionService.getCurrentSessionDetalis(this.sessionID).subscribe((data) => {
      this.currentSessionData = data;
      console.log(this.currentSessionData);

    },(err:any)=>{

      console.log('error occured while subscribing session data..!');

    },()=>{


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



  findService(key: string) {
    let result = '';
    this.serviceData.forEach((service)=>{
      if(service['id'] == key){
        result = service['serviceName'];
      }
    });
    return result;
  }

  sessionDetailClose(){
    this.popup.close();
  }

  viewAllMessages(){
    this.sessionDetailClose();
    this.router.navigate(['specificmessages']);
    // if(Object.keys(this.currentSessionData).length != 0) {
    //
    //   this.restConnectionService.getSpecificMessages(this.sessionID).subscribe((messages)=>{
    //     console.log(messages);
    //
    //     if(Object.keys(messages).length!=0){
    //       this.channel = messages[0]['channel'];
    //       this.tenantCode = messages[0]['tenantCode'];
    //     }
    //     Object.values(messages).forEach((message)=>{
    //       message['date'] = parseDates(message['date']);
    //       this.messages.push(message);
    //     });
    //
    //   },(err:any)=>{
    //     // this.showAllMessagesWaiting = false;
    //     // this.showAllMessagesError = true;
    //   },()=>{
    //     // this.showAllMessagesWaiting = false;
    //     // this.showSpecificMessages = true;
    //     this.router.navigate(['/specificmessages']);
    //   });
    // }
  }


}


