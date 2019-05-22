import {Component,  OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SessionPopupComponent} from "../session-popup/session-popup.component";
import {RestConnectionService} from "../../Services/rest-connection.service";
import {PopupService} from "../../Services/login-popup-service.service";
import {SpecificPopupComponent} from "../specific-popup/specific-popup.component";


@Component({
  selector: 'app-specific-messages',
  templateUrl: './specific-messages.component.html',
  styleUrls: ['./specific-messages.component.css']
})
export class SpecificMessagesComponent implements OnInit {


  dataSource:MatTableDataSource<SpecificMsgData>;
  displayedColumns = ['messageType','typeName','uniqueReqID','timeStamp','responseTime','message'];
  channel :any;
  tenantCode:any;
  currentSessionData:any;
  clientIP:any;
  loginID:any;
  sessionID:any;
  messages=[];
  clickedRow:any;
  Sessiondata:any;
  showAllMessagesWaiting:any;
  showAllMessagesError:any;
  typeName:any[] = [];
  serviceNames:any;
  clickedRowSpecific:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private popup:PopupService, private restConnectionService:RestConnectionService) {
    if(popup.dataService2 !=undefined && popup.dataService1!=undefined){
      this.clickedRow = popup.dataService2;
      this.Sessiondata = popup.dataService1;
    }
  }

  ngOnInit() {

    this.showAllMessagesWaiting = true;
    this.showAllMessagesError = false;
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
    this.clickedRowSpecific = row;
    this.popup.dataService1 = this.clickedRowSpecific;
    if(!this.popup.currentlyLoaded){
      this.popup.modal(SpecificPopupComponent)
    }
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


        this.restConnectionService.getServices().subscribe((data)=>{
          this.serviceNames = data['services'];
          const specificMsgData : SpecificMsgData[] = [];
          for(let message in this.messages){
            for(let service in this.serviceNames){
              if(this.messages[message]['message_type'] == this.serviceNames[service]['id']){
                this.typeName[message] = this.serviceNames[service]['serviceName'];
              }
            }
          }

          let i=0;
          for(let specificmsgdata of this.messages){
            specificMsgData.push(createSpecificMsgData(specificmsgdata,this.typeName[i++],this.tenantCode));
          }
          // console.log(specificMsgData.length);
          this.dataSource = new MatTableDataSource(specificMsgData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.showAllMessagesWaiting = false;

        });


      },(err:any)=>{
        console.log('error:'+err);
        this.showAllMessagesError = true;
      });
    }
  }


}

export interface SpecificMsgData {
  messageType:string;
  typeName: string;
  uniqueReqID:string;
  timeStamp:string;
  responseTime:string;
  message:string;
  tenantCode: string
}

function createSpecificMsgData(specificmsgdata: any,typeName:any,tenantCode:any):SpecificMsgData {
  return {
    messageType: specificmsgdata['message_type'],
    typeName:typeName,
    uniqueReqID: specificmsgdata['unique_request_id'],
    timeStamp: specificmsgdata['date'],
    responseTime: specificmsgdata['responseTime'],
    message: specificmsgdata['message'],
    tenantCode: tenantCode
  };
}
function parseDates(date) {
  var parsedDate = new Date(date);
  return parsedDate.getDate() + "-" + (parsedDate.getMonth() + 1) + "-" + parsedDate. getFullYear()
    + " " + parsedDate.getHours() + ":" + parsedDate.getMinutes() + ":" + parsedDate.getSeconds();
}
