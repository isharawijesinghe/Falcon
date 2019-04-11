import {Component,  OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SessionPopupComponent} from "../session-popup/session-popup.component";
import {RestConnectionService} from "../../Services/rest-connection.service";
import {PopupService} from "../../Services/login-popup-service.service";


@Component({
  selector: 'app-specific-messages',
  templateUrl: './specific-messages.component.html',
  styleUrls: ['./specific-messages.component.css']
})
export class SpecificMessagesComponent implements OnInit {


  dataSource:MatTableDataSource<SpecificMsgData>;
  displayedColumns = ['messageType','uniqueReqID','timeStamp','responseTime','message'];
  channel :any;
  tenantCode:any;
  currentSessionData:any;
  clientIP:any;
  loginID:any;
  sessionID:any;
  messages=[];
  clickedRow:any;
  Sessiondata:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private popup:PopupService, private restConnectionService:RestConnectionService) {
    if(popup.dataService2 !=undefined && popup.dataService1!=undefined){
      this.clickedRow = popup.dataService2;
      this.Sessiondata = popup.dataService1;
    }
  }

  ngOnInit() {
    // this.sessionID = this.messages[0]['session_id'];
    this.sessionID = this.clickedRow.sessionId;
    this.clientIP = this.clickedRow.clientIp;
    this.loginID = this.clickedRow.loginId;

    this.restConnectionService.getCurrentSessionDetalis(this.sessionID).subscribe((data) => {
      this.currentSessionData = data;
      console.log(this.currentSessionData);

    }, (err:any)=>{
      console.log('error:'+err);
    }, ()=>{

      this.subscribeData();

    });

  }

  getMessageDetails(row:any){
    // console.log(row.uniqueReqID);
    // this.isPoppingup = true;
    //yet to be completed
  }

  subscribeData(){
    if(this.currentSessionData != undefined && Object.keys(this.currentSessionData).length != 0) {

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
        console.log('error:'+err);
      },()=>{
        const specificMsgData : SpecificMsgData[] = [];
        for(let specificmsgdata of this.messages){
          specificMsgData.push(createSpecificMsgData(specificmsgdata));
        }
        this.dataSource = new MatTableDataSource(specificMsgData);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
      });
    }
  }


}

export interface SpecificMsgData {
  messageType:string;
  uniqueReqID:string;
  timeStamp:string;
  responseTime:string;
  message:string;
}

function createSpecificMsgData(specificmsgdata: any):SpecificMsgData {
  return {
    messageType: specificmsgdata['message_type'],
    uniqueReqID: specificmsgdata['unique_request_id'],
    timeStamp: specificmsgdata['date'],
    responseTime: specificmsgdata['responseTime'],
    message: specificmsgdata['message']
  };
}
function parseDates(date) {
  var parsedDate = new Date(date);
  return parsedDate.getDate() + "-" + (parsedDate.getMonth() + 1) + "-" + parsedDate. getFullYear()
    + " " + parsedDate.getHours() + ":" + parsedDate.getMinutes() + ":" + parsedDate.getSeconds();
}
