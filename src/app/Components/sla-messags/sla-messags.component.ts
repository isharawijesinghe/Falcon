import {Component, OnInit, ViewChild} from '@angular/core';
import {RestConnectionService} from '../../Services/rest-connection.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SessionData} from '../sessions/sessions.component';

@Component({
  selector: 'app-sla-messags',
  templateUrl: './sla-messags.component.html',
  styleUrls: ['./sla-messags.component.css']
})
export class SlaMessagsComponent implements OnInit {

  SLAMessage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['unique_request_id', 'channel', 'client_ip', 'comm_ver', 'responseTime', 'date', 'login_id', 'message', 'message_type', 'session_id', 'tenantCode'];
  dataSource: MatTableDataSource<SLAMessage>;

  constructor(private restConnectionService : RestConnectionService) {
    const sessiondata: SLAMessage[] = [];
    this.restConnectionService.getSLAMessage().subscribe(data => {
      this.SLAMessage = data;
      console.log( this.SLAMessage);
      for(let sessionData of this.SLAMessage){
        sessiondata.push(createNewSlaMessage(sessionData));
      }
      this.dataSource = new MatTableDataSource(sessiondata);
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface SLAMessage {
  unique_request_id: String
  channel: String;
  client_ip: String;
  comm_ver: String;
  date: String;
  login_id: String;
  message: String;
  message_type: String;
  session_id: String;
  tenantCode: String;
}

function createNewSlaMessage(slaMessage: any):SLAMessage {
  return {
    unique_request_id: slaMessage['unique_request_id'],
    channel: slaMessage['channel'],
    client_ip: slaMessage['client_ip'],
    comm_ver: slaMessage['comm_ver'],
    date: slaMessage['date'],
    login_id: slaMessage['login_id'],
    message: slaMessage['message'],
    message_type: slaMessage['message_type'],
    session_id: slaMessage['session_id'],
    tenantCode: slaMessage['tenantCode']
  };
}
