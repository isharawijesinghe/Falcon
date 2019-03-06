import { Component, OnInit } from '@angular/core';
import {WebSocketConnectionService} from '../../services/web-socket-connection.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private sysMetricObject: any;
  private blockData: any;
  private cpuHistory; any;
  private tpsHeight: any;
  constructor(private websocketConnectionService: WebSocketConnectionService) {
    this.websocketConnectionService.sysMetricUpdated.subscribe((value) => {
      this.sysMetricObject = value;
    });
  }

  ngOnInit() {
  }

}
