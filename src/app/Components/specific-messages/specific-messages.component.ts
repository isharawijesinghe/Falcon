import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SessionData} from "../sessions/sessions.component";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'app-specific-messages',
  templateUrl: './specific-messages.component.html',
  styleUrls: ['./specific-messages.component.css']
})
export class SpecificMessagesComponent implements OnInit {

  @Input() messages: any;
  @Input() showSpecificMessages: any;
  @Input() sessionID: any;
  @Input() clientIP: any;
  @Input() loginID: any;
  @Input() channel: any;
  @Input() tenantCode: any;


  @Output() direct: EventEmitter<boolean> = new EventEmitter<boolean>();

  dataSource:MatTableDataSource<SpecificMsgData>;
  displayedColumns = ['messageType','uniqueReqID','timeStamp','responseTime','message'];
  showSpecificMessagesLocal:boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {

  }

  ngOnInit() {
    // this.sessionID = this.messages[0]['session_id'];

    const specificMsgData : SpecificMsgData[] = [];
    for(let specificmsgdata of this.messages){
      specificMsgData.push(createSpecificMsgData(specificmsgdata));
    }
    this.dataSource = new MatTableDataSource(specificMsgData);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);

    this.showSpecificMessagesLocal = false;
  }

  getMessageDetails(row:any){
    console.log(row.uniqueReqID);


  }


  backToSession(showSpecificMessagesLocal:boolean){
    this.direct.emit(showSpecificMessagesLocal);
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
