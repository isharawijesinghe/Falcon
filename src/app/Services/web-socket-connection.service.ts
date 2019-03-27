import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject, Observer, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketConnectionService {



  constructor(private  http: HttpClient) { }
  private subject: Subject<MessageEvent>;
  private ws: any;
  public messages: Subject<any>  = new Subject<any>();
  private websocketURL: any;
  websocketStatus: any;
  view: any;
  cpuHistory: any;
  sysMetric: any;
  viewData: any;
  nodeTree: any;
  nodeBlock: any;
  tpsCount: any;
  gatewayMetric: any;
  isOmsConnected = false;
  nodeBlockUpdated: Subject<string> = new Subject<string>();
  cpuHistoryUpdated: Subject<{}> = new Subject<{}>();
  sysMetricUpdated: Subject<{}> = new Subject<{}>();
  viewDataUpdated: Subject<{}> = new Subject<{}>();

  public connect(url): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url): Subject<MessageEvent> {
    this.ws = new WebSocket(url);
    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        return this.ws.close.bind(this.ws);
      }
    );
    // in case of send data
    const observer = {
      next: (data: any) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

  initializeWebsocket() {
    const url = 'http://127.0.0.1:8060/server/config';
    this.messages = <Subject<any>> this.connect('ws://127.0.0.1:7804/websocket')
      .pipe(map(response => {
          const data = JSON.parse(response.data);
          return data;
        }
      ));
  }
  setnodeBlock(nodeBlock) {
    this.nodeBlock = nodeBlock;
    this.nodeBlockUpdated.next(this.nodeBlock);
  }
  setcpuHistory(cpuHistory) {
    this.cpuHistory = cpuHistory;
    this.cpuHistoryUpdated.next(this.cpuHistory);
  }
  setsysMetrics(sysMetric) {
    this.sysMetric = sysMetric;
    this.sysMetricUpdated.next(this.sysMetric);
  }
  setviewData(viewData) {
    this.viewData = viewData;
    this.viewDataUpdated.next(this.viewData);
  }
}
