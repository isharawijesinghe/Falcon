import { Component } from '@angular/core';
import {WebSocketConnectionService} from './services/web-socket-connection.service';


// import { Runtime, Inspector } from "@observablehq/notebook-runtime";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Falcon';

  constructor(private websocketService: WebSocketConnectionService) {

    websocketService.initializeWebsocket();
    this.websocketService.cpuHistory = {};
    // this.websocketService.messages.o

    websocketService.messages.subscribe(message => {
      console.log(message);

      this.websocketService.websocketStatus = JSON.stringify(message);

      if(message.messageType === 'showKibanaDashboard'){
        this.websocketService.setShowKibana(message.show);
      }

      if (message.messageType === 'sys_metric') {
        this.websocketService.setsysMetrics(message);
        // sessionStorage.setItem('sys_metric_key',JSON.stringify(message));
      }

      if (message.messageType === 'view') {
        this.websocketService.setviewData(message);
        // sessionStorage.setItem('view_key',JSON.stringify(message));
      }


      if (message.messageType === 'metric') {
        const metric = message;
        const view = this.websocketService.viewData;
        if ( view ) {
          for (let i = 0, iLen = view.nodes.length; i < iLen; i++) {
            if (view.nodes[i].nodeName === metric.node) {
              view.nodes[i].metric = metric;
              this.addCpuUsage(view.nodes[i]);
            }
          }
        }
      }
      if (message.messageType === 'tree') {
        this.websocketService.nodeTree = message;
      }
      if (message.messageType === 'block') {
        this.websocketService.setnodeBlock(message);
      }
      if (message.messageType === 'tpsCount') {
        this.websocketService.tpsCount = message;
      }
      if (message.messageType === 'gatewayMetric') {
        this.websocketService.sysMetric['clients'.toString()] = message.connected;
        if (0 !== message.tps) {
          this.websocketService.sysMetric['tps'.toString()] = message.tps;
        }
      }
      if (message.messageType === 'omsMetric') {
        if ( message.connected ) {
          this.websocketService.isOmsConnected = true;
        } else {
          this.websocketService.isOmsConnected = false;
        }
      }else {
        // unhandle message received
      }
    });
  }

  addCpuUsage(node) {
    // let nodeCpu = this.websocketService.cpuHistory[node.nodeName];
    // if (nodeCpu == null) {
    //   nodeCpu = [];
    //   this.websocketService.cpuHistory[node.nodeName] = nodeCpu;
    // }
    // if (nodeCpu.length > 200) {
    //   nodeCpu.shift();
    //   nodeCpu.push(node.metric.systemCpuUsage);
    // } else {
    //   nodeCpu.push(node.metric.systemCpuUsage);
    // }
    // this.websocketService.setcpuHistory(this.websocketService.cpuHistory);

    let nodeCpu = node.metric.systemCpuUsage;
    this.websocketService.cpuHistory[node.nodeName] = nodeCpu;
    this.websocketService.setcpuHistory(this.websocketService.cpuHistory);
  }

}
